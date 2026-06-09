import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ảnh thumbnail/video sau này phục vụ qua CloudFront — khai báo khi có domain (Phase 6)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
