// Netlify Functions - NewsAPI Proxy
export default async (request, context) => {
  // CORSヘッダーを設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // OPTIONSリクエストの処理
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    console.log('🚀 Netlify Function: News API Request Started');
    
    // 環境変数からAPIキーを取得
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || '5d88b85486d641faba9a410aca9c138b';
    
    console.log('🔑 API Key available:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('❌ No API key found');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: 'NewsAPI key is missing from environment variables'
        }), 
        { status: 500, headers }
      );
    }

    // NewsAPI エンドポイント
    const newsApiUrl = `https://newsapi.org/v2/everything?q=AI&sortBy=publishedAt&pageSize=10&language=en&apiKey=${apiKey}`;
    
    console.log('📡 Fetching from NewsAPI...');
    
    // NewsAPIにリクエスト
    const response = await fetch(newsApiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'AI-News-Netlify-Function/1.0',
      },
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NewsAPI Error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'NewsAPI request failed',
          status: response.status,
          message: errorText
        }), 
        { status: response.status, headers }
      );
    }
    
    const data = await response.json();
    
    console.log('✅ NewsAPI Response received');
    console.log('📊 Status:', data.status);
    console.log('📈 Total results:', data.totalResults);
    console.log('📰 Articles count:', data.articles?.length || 0);
    
    if (data.status === 'error') {
      console.error('❌ NewsAPI returned error:', data.message);
      return new Response(
        JSON.stringify({ 
          error: 'NewsAPI error',
          message: data.message
        }), 
        { status: 400, headers }
      );
    }
    
    // 成功レスポンス
    return new Response(
      JSON.stringify({
        status: 'success',
        totalResults: data.totalResults,
        articles: data.articles
      }), 
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error('❌ Netlify Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }), 
      { status: 500, headers }
    );
  }
};
