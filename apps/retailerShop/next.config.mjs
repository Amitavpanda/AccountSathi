//@ts-check
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force server-side rendering to avoid static export issues
  output: 'standalone',
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure for production deployment
  trailingSlash: true,
  poweredByHeader: false,

  // Disable styled-jsx
  compiler: {
    styledComponents: true // We're using CSS modules instead
  },

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
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Fix Turbopack workspace root — prevents it from scanning parent directories
  // and picking up a package-lock.json outside the monorepo
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },

  // Ensure proper module resolution
  webpack: (config, { isServer }) => {
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
