import { formatMoneyFen } from "@/lib/money"
import Link from "next/link";
import UserOneline from "./UserOneline";

export default async function UserSummaryCard({ user } : { user: { id: number, username: string, nickname: string, role: string, balance: number, chargeMultiplier: number } }) {
    return (
        <Link href={`/manage/users/${user.id}`} className="windowlike master-width">
            <UserOneline user={user} /><br/>
            <span className="info-label">余额：</span><span className="info-value">{formatMoneyFen(user.balance)}</span>
        </Link>
    );
}
