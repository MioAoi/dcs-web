"use client";
import { useState } from "react";
import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { formatRelativeFLTToMinutes } from "@/lib/datetime";
import SvgIcon from "./SvgIcon";
import type { User, Booking, Visit } from "@/generated/prisma/client"

export default function PresentUser({ user, visit, booking, pricing, onelineClickable = false, bookedConsoleDesc, }: { 
    user: User,
    visit: Visit | null,
    pricing: any,
    booking: Booking | null,
    onelineClickable?: boolean,
    bookedConsoleDesc: string | null
}) {
    const [leaveButtonState, setLeaveButtonState] = useState<"avail" | "done">("avail");

    async function handleForceLeave() {
        await fetch("/api/forceleave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: user.id })
        });
        setLeaveButtonState("done");
    }
    return (
        <div className="windowlike master-width card-with-avatar">
            <img className="avatar" src={`/api/avatar/${user.id}`} alt={user.nickname} />
            <div style={{ display: "grid", rowGap: "0rem" }}>
                <UserOneline user={user} clickable={onelineClickable} />
                <div className="bipartite">
                    <span className="info-value"><SvgIcon name="enter" correctAlign={true}/>&thinsp;{formatRelativeFLTToMinutes(visit?.enteredAt.getTime() || booking!.startTime.getTime(), Date.now())}</span>
                    {booking ? (
                        <span className="info-value"><SvgIcon name="exit" correctAlign={true}/>&thinsp;{formatRelativeFLTToMinutes(booking!.endTime.getTime(), Date.now())}</span>
                    ) : null }
                </div>
                <div>
                    {
                    booking ? (
                        <span className="info-value"><SvgIcon name="event" correctAlign={true}/>&thinsp;{bookedConsoleDesc}</span>
                    ) :
                    pricing ? (
                        <span className="info-value"><SvgIcon name="wallet" correctAlign={true}/>&thinsp;{formatMoneyFen(user.balance - calculateCharge(visit!.enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span>
                    ) :
                    <span className="info-value">非包机</span>
                    }
                </div>
            </div>
            {pricing && (
            leaveButtonState === "avail" ? (
                <div className="Button danger" onClick={handleForceLeave} style={{ width: "5rem", height: "4rem"}}>手动<br/>离店</div>
            ) : (
                <div className="Button prepare" style={{ width: "5rem", height: "4rem", display: "grid", justifyItems: "center"}}><SvgIcon name="checkmark" fill="var(--color-success-bright)"/><span>已离店</span></div>
            )
            )}
        </div>
    )
}
