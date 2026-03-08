import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的导航 - 精选实用工具",
  description: "精心挑选的实用工具和网站导航",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="background-gradient" />
        <div className="background-pattern" />
        {children}
      </body>
    </html>
  );
}
