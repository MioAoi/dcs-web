"use client";

import UserOneline from "./UserOneline";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";
import { useRouter } from "next/navigation";
import { formatFLTToMinutes } from "@/lib/datetime";

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
            <div className="card-with-avatar">
                <img className="avatar" src={user.avatar ? `/avatars/${user.avatar}` : user.qqid ? `https://q.qlogo.cn/g?b=qq&nk=${user.qqid}&s=640` : `/avatars/default.webp`} alt={user.nickname} />
                <div>
                    <UserOneline user={user} /><br/>
                    <span>自 <span className="info-value-small">{formatFLTToMinutes(user.enteredAt.getTime())}</span></span><br/>
                    { pricing ? (
                        <span>预计余额：<span className="info-value">{formatMoneyFen(user.balance - calculateCharge(user.enteredAt, new Date(), pricing).total * user.chargeMultiplier)}</span></span>
                    ) : null }
                </div>
            </div>
            { pricing && 
            <div className="bipartite">
                <button onClick={() => router.push(`/manage/users/${user.id}`)}>查看信息</button>
                <button className="danger" onClick={handleForceLeave}>手动离店</button>
            </div>
            }
        </div>
    )
}
