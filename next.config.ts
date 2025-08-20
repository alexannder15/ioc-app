import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Required for GitHub Pages (static HTML export)
  output: 'export',

  // GitHub Pages serves from a subpath: https://alexannder15.github.io/ioc-app/
  basePath: isProd ? '/IOC_APP' : '',
  assetPrefix: isProd ? '/IOC_APP/' : '',

  // Disable image optimization (since Vercel server isn’t available on GH Pages)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
