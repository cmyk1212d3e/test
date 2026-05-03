import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "泡泡爪 Pet Spa | 宠物洗护店",
  description: "社区宠物洗护、美容与护理预约页面。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
