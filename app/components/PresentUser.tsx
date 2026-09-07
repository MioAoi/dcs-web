"use client";

import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { useRouter } from "next/navigation";

export default function PresentUser({ visit } : { visit: { user: { id: number, username: string, nickname: string, role: string, chargeMultiplier: number, balance: number }, enteredAt: Date } }) {
    const router = useRouter();

    async function handleForceLeave() {
        await fetch("/api/forceleave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: visit.user.id })
        });
        router.refresh();
    }
    return (
        <div className="windowlike">
            <UserOneline user={visit.user} /><br/>
            <span className="info-label">进店时间：</span><span className="info-value-small">{visit.enteredAt.toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' })}</span>&#x3000;
            <span className="info-label">已在店：</span><span className="info-value-small">{Math.floor((new Date().getTime() - visit.enteredAt.getTime()) / 60000)} 分钟</span><br/>
            <span className="info-label">扣费倍率：</span><span className="info-value-small">{visit.user.chargeMultiplier.toFixed(2)}</span>
            <span className="info-label">&#x3000;预计扣费：</span><span className="info-value-small">{formatMoneyFen(calculateCharge(visit.enteredAt, new Date()).total * visit.user.chargeMultiplier)}</span><br/>
            <span className="info-label">原余额：</span><span className="info-value-small">{formatMoneyFen(visit.user.balance)}</span><br/>
            <button className="fill-half-form" onClick={() => router.push(`/manage/users/${visit.user.id}`)}>查看信息</button>
            <button className="danger fill-half-form" onClick={handleForceLeave}>手动离店</button>
        </div>
    )
}
