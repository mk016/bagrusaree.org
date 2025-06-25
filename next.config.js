/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/s/files/**',
      },
    ],
  },
  // Completely disable SWC to avoid native addon issues
  swcMinify: false,
  compiler: {
    // Disable SWC compiler entirely
    removeConsole: false,
  },
  experimental: {
    // Disable experimental features that might use SWC
    forceSwcTransforms: false,
    swcTraceProfiling: false,
    swcPlugins: [],
  },
  webpack: (config, { dev, isServer }) => {
    // Force use of Babel instead of SWC
    config.module.rules.forEach((rule) => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.forEach((useItem) => {
          if (useItem.loader && useItem.loader.includes('next-swc-loader')) {
            useItem.loader = 'babel-loader';
            useItem.options = {
              presets: ['next/babel'],
            };
          }
        });
      }
    });

    if (dev) {
      // Optimize for development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;