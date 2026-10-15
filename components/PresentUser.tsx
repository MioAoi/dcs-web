"use client";
import { useState } from "react";
import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { formatRelativeFLTToMinutes } from "@/lib/datetime";
import SvgIcon from "./SvgIcon";

export default function PresentUser({ user, enteredAt, booked, pricing, onelineClickable = false }: { 
    user: {
        id: number,
        qqid: string | null,
        username: string,
        nickname: string,
        role: string,
        chargeMultiplier: number,
        balance: number,
        avatar: string | null,
    },
    enteredAt: Date,
    pricing: any,
    booked: boolean,
    onelineClickable?: boolean
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
        <div className="windowlike master-width generic-vert-grid">
            <div className="card-with-avatar">
                <img className="avatar" src={`/api/avatar/${user.id}`} alt={user.nickname} />
                <div>
                    <UserOneline user={user} clickable={onelineClickable} /><br/>
                    <div className="bipartite">
                        <span className="info-value"><SvgIcon name="enter" correctAlign={true}/>&thinsp;{formatRelativeFLTToMinutes(enteredAt.getTime(), Date.now())}</span>
                        {
                        booked ? (
                            <span className="info-value"><SvgIcon name="event" correctAlign={true}/>&thinsp;包机中</span>
                        ) :
                        pricing ? (
                            <span className="info-value"><SvgIcon name="wallet" correctAlign={true}/>&thinsp;{formatMoneyFen(user.balance - calculateCharge(enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span>
                        ) : null }
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
        </div>
    )
}
