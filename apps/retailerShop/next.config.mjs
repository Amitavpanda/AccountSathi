/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation to avoid prerendering issues
  output: 'standalone',
  trailingSlash: true,
  // Disable image optimization for now to avoid potential issues
  images: {
    unoptimized: true,
  },
  // Add proper headers for CORS if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Disable static optimization for all pages
  experimental: {
    serverExternalPackages: [],
  },
};

export default nextConfig;
