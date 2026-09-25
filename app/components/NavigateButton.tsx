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

export function WhosinButton({ inVenueCount }: { inVenueCount: { customers: number, staffs: number } }) {
    return (
        <Link href="/whosin" className="Button default">
            &#x2302;&nbsp;<span className="customer-count">{inVenueCount.customers}p</span>{inVenueCount.staffs > 0 ? <span className="staff-count">+{inVenueCount.staffs}s</span> : null}
        </Link>
    );
}
