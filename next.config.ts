import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* Performance optimizations */
  compress: true,
  poweredByHeader: false,

  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  /* Production performance monitoring */
  productionBrowserSourceMaps: false,

  /* Bundle analyzer (optional - uncomment to use) */
  // experimental: {
  //   optimizePackageImports: ["@/components/ui"],
  // },

  /* Webpack optimization */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Vendor code in separate chunks
            default: false,
            vendors: false,
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // UI components
            uiComponents: {
              name: "ui-components",
              test: /[\\/]components[\\/]ui[\\/]/,
              chunks: "all",
              priority: 10,
            },
            // Common shared code
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              name: "common",
            },
          },
        },
      }
    }
    return config
  },

  /* Turbopack configuration - added to support Next.js 16+ */
  turbopack: {},
}

export default nextConfig

