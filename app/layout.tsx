import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "直流会馆网页端",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
