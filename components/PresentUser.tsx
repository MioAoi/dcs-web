"use client";
import { useState } from "react";
import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { formatRelativeFLTToMinutes } from "@/lib/datetime";
import NavigateButton from "@/components/NavigateButton";
import SvgIcon from "./SvgIcon";

export default function PresentUser({ user, pricing, onelineClickable = false }: { 
    user: {
        id: number,
        qqid: string | null,
        username: string,
        nickname: string,
        role: string,
        chargeMultiplier: number,
        balance: number,
        enteredAt: Date
        avatar: string | null,
    },
    pricing: any,
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
                        <span className="info-value"><SvgIcon name="enter" correctAlign={true}/>&thinsp;{formatRelativeFLTToMinutes(user.enteredAt.getTime(), Date.now())}</span>
                        { pricing ? (
                            <span className="info-value"><SvgIcon name="wallet" correctAlign={true}/>&thinsp;{formatMoneyFen(user.balance - calculateCharge(user.enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span>
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
