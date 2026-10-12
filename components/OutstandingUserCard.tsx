import UserOneline from "./UserOneline";
import { formatMoneyFen } from "@/lib/money";
import Link from "next/dist/client/link";
import { formatFLTToMinutes, formatRelativeFLTToMinutes } from "@/lib/datetime";

export default function OutstandingUserCard(
    { user } : { user: { id: number, username: string, nickname: string, balance: number, enteredAt: Date, leftAt: Date | null, charge: number, chargeMultiplier: number }}
) {
    return (
        <Link href={`/manage/users/${user.id}`} className="windowlike master-width card-with-avatar">
            <img src={`/api/avatar/${user.id}`} alt={`${user.nickname} 的头像`} className="avatar" />
            <div>
                <UserOneline user={{...user, role: null, chargeMultiplier: user.chargeMultiplier }} /><br/>
                上次来店：<span className="info-value">{formatFLTToMinutes(user.enteredAt.getTime())}
                {user.leftAt ? ` 至 ${formatRelativeFLTToMinutes(user.leftAt.getTime(), user.enteredAt.getTime())}` : "未离"}</span><br/>
                共扣费 <span className="info-value">{formatMoneyFen(user.charge)}</span>&#x3000;现余额：<span className="info-value">{formatMoneyFen(user.balance)}</span>
            </div>
        </Link>
    )
}
