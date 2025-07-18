import { useEffect, useState } from 'react';

type Article = {
  title: string;
  publishedAt: string;
  url: string;
  source: { name: string };
  urlToImage?: string;
  description?: string;
};

// モックデータ（緊急対応用）
const mockArticles: Article[] = [
  {
    title: "🤖 OpenAI、AI安全性研究で大きな進歩を発表",
    publishedAt: "2024-06-29T10:00:00Z",
    url: "https://openai.com/safety-research",
    source: { name: "TechCrunch" },
    urlToImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
    description: "OpenAIの研究者たちがAIアライメントと安全プロトコルにおいて大きな進歩を遂げたと発表しました..."
  },
  {
    title: "🧠 Google、複雑な推論で人間レベルの性能を達成する新AIモデル",
    publishedAt: "2024-06-29T08:30:00Z",
    url: "https://ai.google/research/pubs/pub53256",
    source: { name: "The Verge" },
    urlToImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    description: "Googleの最新AIモデルが前例のない推論能力を実証しました..."
  },
  {
    title: "🏥 AI医療革命：新診断ツールが95%の精度を実現",
    publishedAt: "2024-06-29T06:15:00Z",
    url: "https://www.technologyreview.com/ai-healthcare",
    source: { name: "MIT Technology Review" },
    urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
    description: "AI駆動の新しい診断ツールが医療画像において驚くべき精度を示しています..."
  }
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState(false);
  const [dataSource, setDataSource] = useState<string>('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🚀 Fetching news via Netlify Functions...');
        
        // Netlify Functions経由でニュースを取得
        const functionUrl = '/.netlify/functions/news';
        console.log('🌐 Function URL:', functionUrl);
        
        const response = await fetch(functionUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Function response status:', response.status);
        console.log('📡 Function response ok:', response.ok);
        
        if (!response.ok) {
          let errorData = null;
          try {
            errorData = await response.json();
            console.error('❌ Function error data:', errorData);
          } catch (e) {
            console.error('❌ Could not parse error response:', e);
          }
          
          console.log('🔄 Function error, switching to mock data');
          setArticles(mockArticles);
          setUsesMockData(true);
          setDataSource('Netlify Functions Error - Using Mock Data');
          setError(null);
          return;
        }
        
        const data = await response.json();
        console.log('✅ Function data received successfully');
        console.log('📊 Response keys:', Object.keys(data));
        
        if (data.error) {
          console.error('❌ Function returned error:', data.error);
          console.log('🔄 Switching to mock data due to function error');
          setArticles(mockArticles);
          setUsesMockData(true);
          setDataSource('Function Error: ' + data.message);
          setError(null);
          return;
        }
        
        if (!data.articles || !Array.isArray(data.articles)) {
          console.error('❌ Invalid articles data from function:', typeof data.articles);
          throw new Error('Invalid response from Netlify Function');
        }
        
        console.log('📈 Total results:', data.totalResults);
        console.log('📰 Articles count:', data.articles.length);
        console.log('🎉 Successfully using real NewsAPI data via Netlify Functions!');
        
        setArticles(data.articles);
        setError(null);
        setUsesMockData(false);
        setDataSource('NewsAPI via Netlify Functions');
        
      } catch (err: any) {
        console.error('❌ Fetch error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
        
        // ネットワークエラーやその他の問題の場合もモックデータにフォールバック
        console.log('🔄 Exception caught, using mock data as fallback');
        setArticles(mockArticles);
        setUsesMockData(true);
        setDataSource('Network Error - Using Mock Data');
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">📰 最新AIニュース</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">📡 ニュースを読み込み中...</p>
            <p className="text-blue-600 text-sm mt-1">Netlify Functions経由でNewsAPIから取得中</p>
            <div className="mt-2">
              <div className="animate-pulse bg-blue-200 h-2 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">📰 最新AIニュース</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">⚠️ エラーが発生しました</p>
            <p className="text-red-600 mt-2">{error}</p>
            <div className="mt-3 text-xs text-gray-600">
              <p>🔍 デバッグ情報:</p>
              <p>• データソース: {dataSource}</p>
              <p>• User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'SSR'}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🔄 ページを再読み込み
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (articles.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">📰 最新AIニュース</h1>
          <p className="text-gray-500">ニュースが見つかりませんでした。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📰 最新AIニュース</h1>
        
        {/* モックデータ使用時の通知 */}
        {usesMockData && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              🔄 <strong>モックデータを表示中</strong> - {dataSource}
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Netlify Functionsが正常に動作すると、リアルタイムニュースが表示されます。
            </p>
          </div>
        )}
        
        {/* リアルデータ使用時の成功通知 */}
        {!usesMockData && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              ✅ <strong>リアルタイムニュース表示中</strong> - {dataSource}
            </p>
            <p className="text-green-700 text-xs mt-1">
              NewsAPIから最新のAIニュースを取得中！サーバーサイド処理により制限を回避。
            </p>
          </div>
        )}
        
        <div className="mb-4 text-sm text-gray-600">
          {articles.length}件のニュースを表示中 {usesMockData && '（サンプルデータ）'}
        </div>
        <ul className="space-y-4">
          {articles.map((article, i) => (
            <li key={i} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow">
              {article.urlToImage && (
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
              )}
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-800 hover:underline font-semibold block"
              >
                {article.title}
              </a>
              {article.description && (
                <p className="text-gray-700 mt-2 text-sm">{article.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {new Date(article.publishedAt).toLocaleString('ja-JP')} / {article.source.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
