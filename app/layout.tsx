import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
            className={`${latinFont.variable} ${displayFont.variable}`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}

const latinFont = localFont({
    src: [
        { path: "./fonts/xgf.woff2", weight: "normal", style: "normal" },
        { path: "./fonts/xgf_B.woff2", weight: "bold", style: "normal" },
    ],
    variable: "--font-latin",
    display: "swap",
});

const displayFont = localFont({
    src: [
        { path: "./fonts/AllerDisplay.woff2" },
    ],
    variable: "--font-display",
    display: "swap",
});
