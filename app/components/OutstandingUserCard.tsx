import UserOneline from "./UserOneline";
import { formatMoneyFen } from "@/lib/money";
import Link from "next/dist/client/link";

export default function OutstandingUserCard(
    { userDigest } : { userDigest: { id: number, username: string, nickname: string, balance: number, enteredAt: Date, leftAt: Date | null, charge: number }}
) {
    return (
        <Link href={`/manage/users/${userDigest.id}`} className="windowlike master-width">
            <div className="bipartite">
                <span><UserOneline user={{...userDigest, role: null }} /></span>
                <span>余额：<span className="info-value">{formatMoneyFen(userDigest.balance)}</span></span></div>
            上次入店：<span className="info-value-small">{userDigest.enteredAt.toLocaleString()}</span><br/>
            〃&#x3000;离店：<span className="info-value-small">{userDigest.leftAt ? userDigest.leftAt.toLocaleString() : "未离店"}</span><br/>
            共扣费 <span className="info-value-small">{formatMoneyFen(userDigest.charge)}</span>
        </Link>
    )
}
