import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "sonner";
import { config } from "../config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.tdk.home.title,
  description: config.tdk.home.description,
  keywords: config.tdk.home.keywords,
  icons: {
    icon: '/images/logo-night.png',
    shortcut: '/images/logo-night.png',
    apple: '/images/logo-night.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 从 cookies 中读取主题模式
  const cookieStore = cookies();
  const darkModeCookie = cookieStore.get('darkMode');
  // 确保 darkMode 被正确设置
  const darkMode = darkModeCookie ? darkModeCookie.value === 'true' : false;

  // 将主题模式添加到 document 中，以便客户端组件可以读取
  const htmlClassName = darkMode ? 'dark' : '';

  return (
    <html lang="zh-CN" className={htmlClassName} data-dark-mode={darkMode.toString()}>
      <head>
        {/* 额外的图标配置 */}
        <link rel="apple-touch-icon-precomposed" href="/images/logo-night.png" />
        <meta name="msapplication-TileImage" content="/images/logo-night.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
