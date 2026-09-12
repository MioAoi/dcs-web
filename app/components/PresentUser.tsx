"use client";

import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { useRouter } from "next/navigation";
import { formatFLTToMinutes } from "@/lib/datetime";

export default function PresentUser({ user, pricing } :{ 
user: {
    id: number,
    username: string,
    nickname: string,
    role: string,
    chargeMultiplier: number,
    balance: number,
    enteredAt: Date
},
pricing: any }) {
    const router = useRouter();

    async function handleForceLeave() {
        await fetch("/api/forceleave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: user.id })
        });
        router.refresh();
    }
    return (
        <div className="windowlike master-width generic-vert-grid">
            <span><UserOneline user={user} /> 扣费倍率：<span className="info-value-small">{user.chargeMultiplier.toFixed(2)}</span></span>
            <div>
                进店时间：<span className="info-value-small">{formatFLTToMinutes(user.enteredAt.getTime())}</span>&#x3000;
                已在店 <span className="info-value-small">{Math.floor((new Date().getTime() - user.enteredAt.getTime()) / 60000)} 分钟</span><br/>
                预计扣费：<span className="info-value-small">{formatMoneyFen(calculateCharge(user.enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span>&#x3000;
                原余额：<span className="info-value-small">{formatMoneyFen(user.balance)}</span><br/>
            </div>
            <div className="bipartite">
                <button onClick={() => router.push(`/manage/users/${user.id}`)}>查看信息</button>
                <button className="danger" onClick={handleForceLeave}>手动离店</button>
            </div>
        </div>
    )
}
