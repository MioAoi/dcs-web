"use client";
import Link from "next/dist/client/link";
import SvgIcon from "@/app/components/SvgIcon";

export default function NavigateButton({ href, buttonText, buttonColor } : { href: string, buttonText: string, buttonColor?: string }) {
    let actualText = buttonText;
    actualText = actualText.replaceAll("^", "▲\uFE0E").replaceAll("▲", "▲\uFE0E").replaceAll(">", "▶\uFE0E").replaceAll("<", "◀\uFE0E");
    const iconName = actualText.match(/\[(.+)\]/)?.[1];
    return (
        <Link href={href} className={`Button ${buttonColor ?? "default"}`}>
            {iconName ? <SvgIcon name={iconName} /> : null}
            {"\u2009" + actualText.replace(/\[(.+)\]/, "")}
        </Link>
    );
}

export function WhosinButton({ inVenueCount }: { inVenueCount: { customers: number, staffs: number } }) {
    return (
        <Link href="/whosin" className="Button default">
            <SvgIcon name="cabin" />
            &thinsp;<span className="customer-count">{inVenueCount.customers}p</span>{inVenueCount.staffs > 0 ? <span className="staff-count">+{inVenueCount.staffs}s</span> : null}
        </Link>
    );
}
