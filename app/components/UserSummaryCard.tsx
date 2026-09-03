import { formatMoneyFen } from "@/lib/money"
import Link from "next/dist/client/link";

export default async function UserSummaryCard({ user }) {
    return (
        <Link href={`/manage/users/${user.id}`} className="windowlike master-width">
            <span className="nickname">{user.nickname}</span> <span className="username">{user.username}</span><br/>
            <span className="info-label">余额：</span><span className="info-value">{formatMoneyFen(user.balance)}</span>
        </Link>
    );
}
