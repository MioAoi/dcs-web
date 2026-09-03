import Link from "next/dist/client/link";
import LogoutButton from "@/app/components/LogoutButton";
import EnterButton from "@/app/components/EnterButton";
import { getCurrentVisit } from "@/lib/visits";
import LeaveButton from "../components/LeaveButton";
import StayTimer from "../components/StayTimer";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen } from "@/lib/money";
import ChargeTimer from "@/app/components/ChargeTimer";

export default async function Dashboard() {
    const user = await requireUserOrRedirect();
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const balance = user.balance ?? 0;
    const formatBalance = formatMoneyFen(balance);

    const condManageButton = user.role === "STAFF" || user.role === "ADMIN" ? (
        <Link href="/manage" className="Button">▶管理页</Link>
    ) : null;
    const condEnterBUtton = notInVenue ? <EnterButton/> : <div className="Button disabled">进店</div>;
    const condLeaveButton = !notInVenue ? <LeaveButton/> : <div className="Button disabled">离店</div>;
    const condStayTimer = !notInVenue ? <StayTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value">不在店</span>;
    const condChargeTimer = !notInVenue ? <ChargeTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value"/>;

    return (
        <main>
            <span className="master-width">欢迎来到直流会馆，{displayName}。</span>
            <div className="master-width windowlike">
                <b>余额：</b><span className="info-value">{formatBalance}</span>
            </div>
            <div className="master-width windowlike">
                <span className="info-label">在店时长：</span>
                {condStayTimer}<br/>
                
                <span className="info-label">当前费用：</span>
                {condChargeTimer}<br/>
                {condEnterBUtton}
                {condLeaveButton}
            </div>
            <div className="master-width">
                <LogoutButton/>
                {condManageButton}
            </div>
        </main>
    );
}
