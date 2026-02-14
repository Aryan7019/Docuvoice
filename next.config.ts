import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance Optimizations */
  
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress output
  compress: true,
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Optimize bundle
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', 'framer-motion'],
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
