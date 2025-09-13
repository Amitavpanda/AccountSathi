/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force server-side rendering to avoid static export issues
  output: 'standalone',
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure for production deployment
  trailingSlash: true,
  poweredByHeader: false,

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

  // Configure for better Vercel compatibility
  experimental: {
    // Keep App Router behavior consistent
    appDir: true,
    serverActions: true
  },

  // Production optimizations
  swcMinify: true,

  // Ensure proper module resolution
  webpack: (config, { isServer }) => {
    // Add module fallbacks
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
