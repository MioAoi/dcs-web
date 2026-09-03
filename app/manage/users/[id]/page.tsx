import { prisma } from "@/lib/prisma";
import { notFound} from "next/navigation";
import { formatMoneyFen } from "@/lib/money";
import ManualBalanceChangeForm from "@/app/components/ManualBalanceChangeForm";
import Link from "next/dist/client/link";
import { roleLabel } from "@/lib/labels";
import { getCurrentUser } from "@/lib/auth";
import RoleEditPanel from "@/app/components/RoleEditPanel";

export default async function CurrentUserPage({
    params,
} : {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) }
    }); if (!user) {
        notFound();
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "ADMIN" && user.role === "ADMIN")) {
        return (
            <main>
            <h2>用户信息</h2>
            <div><span className="nickname">{user.nickname}</span> <span className="username">{user.username}</span>, {roleLabel[user.role]}</div>
            <p>您没有权限查看或操作该用户。</p>
            </main>
        )
    }

    const lastVisit = await prisma.visit.findFirst({
        where: { userId: Number(id) },
        orderBy: { enteredAt: "desc" }
    });
    const isInVenue = lastVisit && !lastVisit.leftAt;
    const enteredOrLeftInfo = isInVenue ?
        <><span className="info-label">上次进店：</span><span className="info-value">{lastVisit?.enteredAt.toLocaleString()}</span></>
        : lastVisit?.leftAt ?
        <><span className="info-label">上次离店：</span><span className="info-value">{lastVisit?.leftAt?.toLocaleString()}</span></>
        : <>未曾进店</>;

    return (
        <main>
            
            <h2>用户信息</h2>
            <div><span className="nickname">{user.nickname}</span> <span className="username">{user.username}</span>, {roleLabel[user.role]}</div>
            <div className="windowlike master-width">
                <span className="info-label">余额：</span><span className="info-value">{formatMoneyFen(user.balance)}</span>，其中<br/>
                <span className="info-label">现金：</span><span className="info-value">{formatMoneyFen(user.cashBalance)}</span>、
                <span className="info-label">赠点：</span><span className="info-value">{formatMoneyFen(user.bonusBalance)}</span><br/>
                <span className="info-label">扣费倍率：</span><span className="info-value">{user.chargeMultiplier}</span><br/>
            </div>
            <ManualBalanceChangeForm userId={user.id} />
            { currentUser && currentUser.role === "ADMIN" && <RoleEditPanel userId={user.id} userCurrentRole={user.role} /> }
            <div className="windowlike master-width">
                {enteredOrLeftInfo}
            </div>
            <div className="master-width">
                <Link href="/manage/users" className="Button escape">返回用户查询</Link>
            </div>
            
        </main>
    );
}
