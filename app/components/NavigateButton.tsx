"use client";
import Link from "next/dist/client/link";

export default function NavigateButton({ href, buttonText, buttonColor } : { href: string, buttonText: string, buttonColor?: string }) {
    let actualText = buttonText;
    actualText = actualText.replaceAll("^", "▲\uFE0E").replaceAll("▲", "▲\uFE0E").replaceAll(">", "▶\uFE0E").replaceAll("<", "◀\uFE0E");
    return (
        <Link href={href} className={`Button ${buttonColor ?? "default"}`}>
            {actualText}
        </Link>
    );
}
