/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['next-mdx-remote'],
  // ... other configurations
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', '97.76.98.30', 'batteriesetconline.com', 'www.batteriesetconline.com'],
    },
  },
};



export default nextConfig;

