import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Cho tester truy cập qua Cloudflare quick tunnel (URL *.trycloudflare.com đổi mỗi lần chạy)
  allowedDevOrigins: ["*.trycloudflare.com"],
  // Ảnh thumbnail/video sau này phục vụ qua CloudFront — khai báo khi có domain (Phase 6)
  images: {
    remotePatterns: [],
  },
  experimental: {
    // Cho phép upload video qua Server Action (mặc định giới hạn 1MB)
    serverActions: {
      bodySizeLimit: "500mb",
      // Chống CSRF của Server Actions — cho phép origin của tunnel (login/form mới chạy qua URL public)
      allowedOrigins: ["*.trycloudflare.com"],
    },
  },
};

export default nextConfig;
