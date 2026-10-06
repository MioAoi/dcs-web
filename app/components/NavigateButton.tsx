"use client";
import Link from "next/dist/client/link";
import SvgIcon from "@/app/components/SvgIcon";

export default function NavigateButton({ href, buttonText, buttonColor, inline = false } : { href: string, buttonText: string, buttonColor?: string, inline?: boolean }) {
    let actualText = buttonText;
    actualText = actualText.replaceAll("^", "▲\uFE0E").replaceAll("▲", "▲\uFE0E").replaceAll(">", "▶\uFE0E").replaceAll("<", "◀\uFE0E");
    const iconName = actualText.match(/\[(.+)\]/)?.[1];
    if (inline) {
        return (
            <span onClick={() => window.location.href = href} className={`Button-inline ${buttonColor ?? "default"}`}>
                {iconName ? <SvgIcon name={iconName} /> : null}
                {"\u2009" + actualText.replace(/\[(.+)\]/, "")}
            </span>
        );
    } else return (
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
