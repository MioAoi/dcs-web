"use server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatMoneyFen } from "@/lib/money";
import ManualBalanceChangeForm from "@/app/components/ManualBalanceChangeForm";
import { getCurrentUser } from "@/lib/auth";
import RoleEditPanel from "@/app/components/RoleEditPanel";
import UserOneline from "@/app/components/UserOneline";
import DepositDietsPanel from "@/app/components/DepositDietsPanel";
import NavigateButton from "@/app/components/NavigateButton";
import fs from "fs";
import { formatFLTToMinutes } from "@/lib/datetime"
import { getUserAvailDepositDiets } from "@/lib/users";

export default async function CurrentUserPage({
    params,
} : {
    params: Promise<{ id: string }>
}) {
    const deposit_diets = JSON.parse(fs.readFileSync('profiles/deposit_diets.json', 'utf-8'));

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
            <UserOneline user={user} /><br/>
            <p>您没有权限查看或操作该用户。</p>
            </main>
        )
    }

    const adminOperates = currentUser.role === "ADMIN";

    const lastVisit = await prisma.visit.findFirst({
        where: { userId: Number(id) },
        orderBy: { enteredAt: "desc" }
    });
    const isInVenue = lastVisit && !lastVisit.leftAt;
    const enteredOrLeftInfo = isInVenue ?
        <>本次进店：<span className="info-value-small">{formatFLTToMinutes(lastVisit?.enteredAt.getTime())}</span></>
        : lastVisit?.leftAt ?
        <>上次离店：<span className="info-value-small">{formatFLTToMinutes(lastVisit?.leftAt.getTime())}</span></>
        : <>未曾进店</>;

    return (
        <main><h2>用户信息</h2>
            <div className="card-with-avatar invwindow master-width">
                <img className="avatar" src={user.avatar ? `/avatars/${user.avatar}` : user.qqid ? `https://q.qlogo.cn/g?b=qq&nk=${user.qqid}&s=640` : `/avatars/default.webp`} alt={user.nickname} />
                <UserOneline user={user} />
            </div>

            <div className="windowlike master-width">
                余额：<span className="info-value">{formatMoneyFen(user.balance)}</span>，其中<br/>
                现金：<span className="info-value-small">{formatMoneyFen(user.cashBalance)}</span>、
                赠点：<span className="info-value-small">{formatMoneyFen(user.bonusBalance)}</span>，<br/>
                扣费倍率：<span className="info-value-small">{user.chargeMultiplier}</span><br/>
            </div>

            <div className="windowlike master-width">
                已验证QQ号：<span className="info-value-small">{user.qqid ?? "无"}</span><br/>
            </div>

            <div className="invwindow master-width bipartite">
                <NavigateButton href={`/manage/users/${user.id}/ledgers`} buttonText="查看余额变动" buttonColor="action" />
                <NavigateButton href={`/manage/users/${user.id}/visits`} buttonText="查看来店记录" buttonColor="action" />
            </div>

            <DepositDietsPanel userId={user.id} diets={await getUserAvailDepositDiets(deposit_diets)} manual={true} />
            <ManualBalanceChangeForm userId={user.id} adminOperates={adminOperates} />

            { currentUser && currentUser.role === "ADMIN" && <RoleEditPanel userId={user.id} userCurrentRole={user.role} chargeMultiplier={user.chargeMultiplier} /> }

            <div className="windowlike master-width">
                {enteredOrLeftInfo}
            </div>
            
            <div className="master-width invwindow">
                <NavigateButton href="/manage/users" buttonText="▲返回用户查询" buttonColor="escape" />
            </div>
        </main>
    );
}
