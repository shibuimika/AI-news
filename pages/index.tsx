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
  },
  {
    title: "�� 自動運転AI、都市部での完全自律走行を実現",
    publishedAt: "2024-06-29T04:45:00Z",
    url: "https://techcrunch.com/autonomous-driving-breakthrough",
    source: { name: "Wired" },
    urlToImage: "https://images.unsplash.com/photo-1549399497-0c45a0f9e1c6?w=500",
    description: "最新の自動運転技術が複雑な都市環境での完全自律走行を実現しました..."
  },
  {
    title: "🎨 AI生成アート、オークションで史上最高額を記録",
    publishedAt: "2024-06-28T22:30:00Z",
    url: "https://artnet.com/ai-art-auction-record",
    source: { name: "Artnet News" },
    urlToImage: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500",
    description: "AI生成アートワークがオークションで従来の記録を大幅に更新しました..."
  }
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🚀 Fetching news directly from NewsAPI...');
        
        // より確実なフォールバック機能
        let apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        let keySource = 'env';
        
        // 環境変数が設定されていない場合のフォールバック
        if (!apiKey || apiKey.trim() === '') {
          apiKey = '7efa2618d1d14e01af91446ec7181fe7';
          keySource = 'fallback';
          console.log('⚠️ 環境変数未設定のため、フォールバックAPIキーを使用');
        }
        
        console.log('🔑 API Key available:', !!apiKey);
        console.log('🔑 API Key source:', keySource);
        console.log('🔑 Key length:', apiKey?.length || 0);
        console.log('🌍 Environment:', typeof window !== 'undefined' ? 'client' : 'server');
        
        if (!apiKey) {
          throw new Error('APIキーが設定されていません');
        }
        
        const url = `https://newsapi.org/v2/everything?q=AI&sortBy=publishedAt&pageSize=10&language=en&apiKey=${apiKey}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'AI-News-App/1.0'
          }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          
          // NewsAPIエラーの場合、モックデータにフォールバック
          if (response.status === 426 || response.status === 401 || response.status === 429) {
            console.log('🔄 NewsAPIエラーのため、モックデータを使用します');
            setArticles(mockArticles);
            setUsesMockData(true);
            setError(null);
            return;
          }
          
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Data received:', data.articles?.length, 'articles');
        
        if (data.status === 'error') {
          // NewsAPIエラーの場合もモックデータにフォールバック
          console.log('�� NewsAPIエラーのため、モックデータを使用します');
          setArticles(mockArticles);
          setUsesMockData(true);
          setError(null);
          return;
        }
        
        if (!data.articles || !Array.isArray(data.articles)) {
          throw new Error('Invalid response from NewsAPI');
        }
        
        setArticles(data.articles);
        setError(null);
        setUsesMockData(false);
        
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        console.log('🔄 エラーのため、モックデータを使用します');
        setArticles(mockArticles);
        setUsesMockData(true);
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
              <p>• NEXT_PUBLIC_NEWS_API_KEY: {process.env.NEXT_PUBLIC_NEWS_API_KEY ? '設定済み' : '未設定'}</p>
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
              🔄 <strong>モックデータを表示中</strong> - NewsAPIの制限により、サンプルデータを表示しています。
              新しいAPIキーを設定すると、リアルタイムニュースが表示されます。
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
