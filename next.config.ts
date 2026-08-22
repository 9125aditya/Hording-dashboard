import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rrxcmfmfzejvuntzlhah.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'okwdkfcxapwkxlfcirjf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'mtuwmsqnvxlrplxcejtb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
};

export default nextConfig;
