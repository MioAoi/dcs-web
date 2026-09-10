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
        { path: "./fonts/Aller_R.woff2", weight: "normal", style: "normal" },
        { path: "./fonts/Aller_B.woff2", weight: "bold", style: "normal" },
        { path: "./fonts/Aller_BI.woff2", weight: "bold", style: "italic" },
        { path: "./fonts/Aller_I.woff2", weight: "normal", style: "italic" },
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
