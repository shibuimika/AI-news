/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Netlify対応設定
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // 環境変数の設定
  env: {
    NEWS_API_KEY: process.env.NEWS_API_KEY,
  },
  
  // 静的エクスポート設定（必要に応じて）
  // output: 'export',
}

module.exports = nextConfig
