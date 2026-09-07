import Link from "next/dist/client/link";
import LogoutButton from "@/app/components/LogoutButton";
import EnterButton from "@/app/components/EnterButton";
import { getCurrentVisit } from "@/lib/visits";
import LeaveButton from "../components/LeaveButton";
import StayTimer from "../components/StayTimer";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen } from "@/lib/money";
import ChargeTimer from "@/app/components/ChargeTimer";
import { ADMISSION_BALANCE } from "@/profiles/rates";

export default async function Dashboard() {
    const user = await requireUserOrRedirect();
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const formatBalance = formatMoneyFen(user.balance ?? 0);
    const formatCash = formatMoneyFen(user.cashBalance ?? 0);
    const formatBonus = formatMoneyFen(user.bonusBalance ?? 0);

    const condManageButton = user.role === "STAFF" || user.role === "ADMIN" ? (
        <Link href="/manage" className="Button">▶管理页</Link>
    ) : null;
    const condEnterBUtton = notInVenue && (user.balance >= ADMISSION_BALANCE || user.chargeMultiplier == 0) ? <EnterButton/> : <div className="Button disabled">进店</div>;
    const condLeaveButton = !notInVenue ? <LeaveButton/> : <div className="Button disabled">离店</div>;
    const condStayTimer = !notInVenue ? <StayTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value">不在店</span>;
    const condChargeTimer = !notInVenue ? <ChargeTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0} chargeMultiplier={user.chargeMultiplier ?? 1}/> : <span className="info-value"/>;

    return (
        <main>
            <h2>概览</h2>
            <div className="invwindow">欢迎来到直流会馆，{displayName}。</div>
            <div className="master-width windowlike">
                当前余额：<span className="info-value">{formatBalance}</span>，其中<br/>
                现金：<span className="info-value-small">{formatCash}</span>、
                赠点：<span className="info-value-small">{formatBonus}</span>。<br/>
                你的扣费倍率是 <span className="info-value-small">{user.chargeMultiplier ?? 1}</span> 。
            </div>
            <div className="master-width windowlike">
                在店时长：
                {condStayTimer}<br/>
                
                当前费用：
                {condChargeTimer}<br/>
                <div className="bipartite bare">
                    {condEnterBUtton}
                    {condLeaveButton}
                </div>
            </div>
            <div className="master-width invwindow generic-vert-grid">
                <Link href="/selfinfo" className="Button">个人信息</Link>
                <LogoutButton/>
                {condManageButton}
            </div>
        </main>
    );
}
