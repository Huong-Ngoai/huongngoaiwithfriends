import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "huongngoaiwithfriends",
  description: "Game nhóm vui vẻ cùng bạn bè",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* MÃ GOOGLE ADSENSE - BẮT ĐẦU KIẾM TIỀN */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877535881649133"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
