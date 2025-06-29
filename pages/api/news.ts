import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== News API Handler Started ===');
  
  const apiKey = process.env.NEWS_API_KEY;
  console.log('API Key exists:', !!apiKey);
  
  if (!apiKey) {
    console.error('NEWS_API_KEY is not set');
    return res.status(500).json({ error: 'APIキーが設定されていません' });
  }
  
  const url = `https://newsapi.org/v2/everything?q=AI&sortBy=publishedAt&pageSize=10&language=en&apiKey=${apiKey}`;
  console.log('Request URL:', url.replace(apiKey, '[HIDDEN]'));

  try {
    console.log('Fetching from NewsAPI...');
    const response = await fetch(url);
    console.log('NewsAPI Response Status:', response.status);
    console.log('NewsAPI Response OK:', response.ok);
    
    const data = await response.json();
    console.log('NewsAPI Response Data Keys:', Object.keys(data));
    console.log('Articles Count:', data.articles?.length || 0);
    
    if (data.status === 'error') {
      console.error('NewsAPI Error:', data);
      return res.status(400).json({ error: `NewsAPI Error: ${data.message}` });
    }
    
    if (!data.articles || !Array.isArray(data.articles)) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Invalid response from NewsAPI' });
    }
    
    console.log('=== Sending Articles to Frontend ===');
    res.status(200).json(data.articles);
  } catch (error: any) {
    console.error('API Handler Error:', error);
    res.status(500).json({ error: 'ニュース取得に失敗しました', details: error.message });
  }
}
