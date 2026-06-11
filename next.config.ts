import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ảnh thumbnail/video sau này phục vụ qua CloudFront — khai báo khi có domain (Phase 6)
  images: {
    remotePatterns: [],
  },
  experimental: {
    // Cho phép upload video qua Server Action (mặc định giới hạn 1MB)
    serverActions: { bodySizeLimit: "500mb" },
  },
};

export default nextConfig;
