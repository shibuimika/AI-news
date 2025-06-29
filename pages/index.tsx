import { useEffect, useState } from 'react';

type Article = {
  title: string;
  publishedAt: string;
  url: string;
  source: { name: string };
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🚀 Fetching news...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト
        
        const response = await fetch('/api/news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response received:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Data received:', data.length, 'articles');
        
        setArticles(data);
        setError(null);
        
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        
        if (err.name === 'AbortError') {
          setError('リクエストがタイムアウトしました（10秒）');
        } else if (err.message.includes('Failed to fetch')) {
          setError('サーバーとの接続に失敗しました。ページを再読み込みしてください。');
        } else {
          setError(`エラー: ${err.message}`);
        }
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
        <div className="mb-4 text-sm text-gray-600">
          {articles.length}件のニュースを表示中
        </div>
        <ul className="space-y-4">
          {articles.map((article, i) => (
            <li key={i} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-800 hover:underline font-semibold block"
              >
                {article.title}
              </a>
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
