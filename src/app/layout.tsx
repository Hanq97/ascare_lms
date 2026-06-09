import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASCare LMS — 介護動画学習プラットフォーム",
  description: "介護分野 外国人材向け 動画学習・進捗管理プラットフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Dùng <link> Google Fonts thay next/font: phủ đầy đủ glyph tiếng Nhật (unicode-range subset). */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
