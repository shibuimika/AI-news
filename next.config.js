/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 静的エクスポート設定
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // 環境変数をクライアントサイドで使用可能にする
  env: {
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEWS_API_KEY,
  },
}

module.exports = nextConfig
