import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
    // Allow access to remote image placeholder.
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',
          pathname: '/**', // This allows any path under the hostname
        },
      ],
    },
    transpilePackages: ['motion'],
    webpack: (config, { dev, isServer, webpack }) => {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      if (dev && process.env.DISABLE_HMR === 'true') {
        config.watchOptions = {
          ignored: /.*/,
        };
      }

      // Only apply client-side fallbacks and replacements; never touch server bundles
      if (!isServer) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(/^node:(fs|https)$/, (resource: { request: string }) => {
            resource.request = resource.request.replace(/^node:/, '');
          })
        );

        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          https: false,
          http: false,
          stream: false,
          crypto: false,
          path: false,
          os: false,
          canvas: false,
        };
      }

      return config;
    },
  };

export default nextConfig;
