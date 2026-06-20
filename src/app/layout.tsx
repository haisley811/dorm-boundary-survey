import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "你的宿舍边界",
  description: "一个关于床帘、耳机、沉默与私人空间的 3 分钟测试。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="research-board min-h-screen antialiased">{children}</body>
    </html>
  );
}
