import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  //Required for GitHub Pages (static HTML export)
  output: 'export',
  // GitHub Pages serves from a subpath: https://alexannder15.github.io/ioc-app/
  basePath: process.env.PAGES_BASE_PATH,
  // Disable image optimization (since Vercel server isn’t available on GH Pages)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
