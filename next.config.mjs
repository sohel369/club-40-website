/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/club-40-website',
  assetPrefix: '/club-40-website/',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
