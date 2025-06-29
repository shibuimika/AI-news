# 📰 AI News App

NewsAPIを使用した最新のAI関連ニュースを表示するWebアプリケーションです。

## 🚀 機能

* ✅ NewsAPIからAI関連ニュースを取得
* ✅ 最大10件のニュース一覧表示
* ✅ レスポンシブデザイン（モバイル対応）
* ✅ 外部リンクへの安全な遷移
* ✅ ローディング・エラーハンドリング

## 🛠️ 技術スタック

* **フレームワーク**: Next.js 14 (Pages Router)
* **言語**: TypeScript
* **スタイル**: Tailwind CSS
* **API**: NewsAPI v2
* **デプロイ**: Netlify対応

## 📦 ローカル開発

### 前提条件

* Node.js 18.x以上
* npm または yarn

### セットアップ

1. **リポジトリをクローン**
```bash
git clone https://github.com/shibuimika/AI-news.git
cd AI-news
```

2. **依存関係をインストール**
```bash
npm install
```

3. **環境変数を設定**
`.env.local`ファイルを作成して、NewsAPIキーを設定：
```env
NEWS_API_KEY=your_newsapi_key_here
```

4. **開発サーバーを起動**
```bash
npm run dev
```

5. **ブラウザでアクセス**
http://localhost:3000 にアクセス

## 🌐 Netlifyデプロイ

### 自動デプロイ（推奨）

1. **GitHubにプッシュ**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Netlifyでサイトを作成**
   * Netlifyにログイン
   * "New site from Git"を選択
   * GitHubリポジトリを選択
   * ビルド設定は自動検出されます

3. **環境変数を設定**
   * Netlifyダッシュボード → Site settings → Environment variables
   * 以下の環境変数を追加：
   ```
   NEWS_API_KEY = your_newsapi_key_here
   ```

4. **デプロイ完了**
   * 自動でビルド・デプロイが開始されます
   * 完了後、割り当てられたURLでアクセス可能

## 📝 API仕様

### GET /api/news

AI関連ニュースを最大10件取得します。

**Response:**
```json
[
  {
    "title": "記事タイトル",
    "publishedAt": "2024-01-01T00:00:00Z",
    "url": "https://example.com/article",
    "source": {
      "name": "ソース名"
    }
  }
]
```

## 🔍 トラブルシューティング

### よくある問題

1. **APIキーエラー**
   * `.env.local`にAPIキーが正しく設定されているか確認
   * NewsAPIの利用制限に達していないか確認

2. **ビルドエラー**
   * Node.jsのバージョンが18.x以上か確認
   * `npm install`で依存関係を再インストール

## 📄 ライセンス

MIT License

---

開発者: shibuimika
作成日: 2025年6月
