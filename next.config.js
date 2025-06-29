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
  
  // 環境変数の明示的な設定
  env: {
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY,
  },
}

module.exports = nextConfig
