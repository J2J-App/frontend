import createMDX from '@next/mdx';
import {NextConfig} from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Remove deprecated swcMinify (enabled by default in Next.js 13+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Increase timeout limits
  staticPageGenerationTimeout: 1000,
  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.default = {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      };
    }
    return config;
  },
};

const withMDX = createMDX({

})

module.exports = withMDX(nextConfig);
