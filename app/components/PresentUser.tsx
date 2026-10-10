"use client";
import { useState } from "react";
import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { formatFLTToMinutes } from "@/lib/datetime";
import NavigateButton from "@/app/components/NavigateButton";
import SvgIcon from "./SvgIcon";

export default function PresentUser({ user, pricing } :{ 
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
pricing: any }) {
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
                    <UserOneline user={user} /><br/>
                    <span>自 <span className="info-value">{formatFLTToMinutes(user.enteredAt.getTime())}</span></span><br/>
                    { pricing ? (
                        <span>预计余额：<span className="info-value">{formatMoneyFen(user.balance - calculateCharge(user.enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span></span>
                    ) : null }
                </div>
            </div>
            { pricing && 
            <div className="bipartite">
                <NavigateButton buttonText="查看信息" href={`/manage/users/${user.id}`} />
                {leaveButtonState === "avail" ? (
                    <button className="danger" onClick={handleForceLeave}>手动离店</button>
                ) : (
                    <button className="prepare" disabled={true}><SvgIcon name="checkmark" fill="var(--color-success-bright)"/>已手动离店</button>
                )}
            </div>
            }
        </div>
    )
}
