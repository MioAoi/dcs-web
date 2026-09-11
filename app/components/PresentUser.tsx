"use client";

import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { useRouter } from "next/navigation";
import { formatFLTToMinutes } from "@/lib/datetime";

export default function PresentUser({ visit, pricing } : { 
    visit: { user: { id: number, username: string, nickname: string, role: string, chargeMultiplier: number, balance: number }, enteredAt: Date, }, pricing: { circadyRates: any[], globalDiscount: number } }) {
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
        <div className="windowlike master-width generic-vert-grid">
            <UserOneline user={visit.user} />
            <div>
                进店时间：<span className="info-value-small">{formatFLTToMinutes(visit.enteredAt.getTime())}</span>&#x3000;
                已在店：<span className="info-value-small">{Math.floor((new Date().getTime() - visit.enteredAt.getTime()) / 60000)} 分钟</span><br/>
                扣费倍率：<span className="info-value-small">{visit.user.chargeMultiplier.toFixed(2)}</span>
                &#x3000;预计扣费：<span className="info-value-small">{formatMoneyFen(calculateCharge(visit.enteredAt, new Date(), pricing).total * visit.user.chargeMultiplier)}</span>
                &#x3000;原余额：<span className="info-value-small">{formatMoneyFen(visit.user.balance)}</span><br/>
            </div>
            <div className="bipartite">
                <button className="fill-half-form" onClick={() => router.push(`/manage/users/${visit.user.id}`)}>查看信息</button>
                <button className="danger fill-half-form" onClick={handleForceLeave}>手动离店</button>
            </div>
        </div>
    )
}
