import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const basePath = isProd ? "/Pixelize" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    domains: ['localhost']
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/ERP/:path*",
        destination: "http://localhost/ERP/:path*",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
