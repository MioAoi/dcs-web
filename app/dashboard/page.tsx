"use server";
import EnterButton from "@/app/components/EnterButton";
import { getCurrentVisit } from "@/lib/visits";
import LeaveButton from "../components/LeaveButton";
import StayTimer from "../components/StayTimer";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen } from "@/lib/money";
import ChargeTimer from "@/app/components/ChargeTimer";
import { loadCurrentPricing } from "@/lib/load";
import fs from "fs";
import { formatFLTToMinutes, greeting } from "@/lib/datetime";
import { getUserPass, getUserTotalSpent } from "@/lib/users";
import { QRCodeSVG } from "qrcode.react";
import PlayerNavigation from "../components/PlayerNavigation";
import UserPricingSummary from "../components/UserPricingSummary";
import PassLiteCard from "../components/pass/PassLiteCard";

export default async function Dashboard() {
    const now = new Date().getTime();

    const currentPricing = loadCurrentPricing();
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const user = await requireUserOrRedirect();
    const userPass = await getUserPass(user.id);
    const recent30dSpent = await getUserTotalSpent(user.id, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    const timeString = formatFLTToMinutes(now, false);

    const announcements: { message4All: string[], message4Paid: string[] } = JSON.parse(fs.readFileSync("profiles/announcements.json", "utf-8"));
    
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);

    const condStayTimer = !notInVenue ? <StayTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value">不在店</span>;
    const condChargeTimer = !notInVenue ? <ChargeTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0} chargeMultiplier={user.chargeMultiplier ?? 1} pricing={currentPricing} /> : <span className="info-value"/>;

    return (
        <main>
            <PlayerNavigation buttonManage={user.role === "STAFF" || user.role === "ADMIN"} buttonLogout={true} />
            <div className="master-width invwindow split">
                <span>{greeting()}，{displayName}</span>
                <span className="info-value bear-right">{timeString}</span>
            </div>
            <UserPricingSummary userId={user.id} />
            <div className="master-width windowlike">
                <div className="nulldiv tripartite">
                    <span>总余额 <span className={user.balance >= admissionBalance ? "info-value" : "money-owe"}>{formatMoneyFen(user.balance ?? 0)}</span></span>
                    <span>现金：<span className="info-value">{formatMoneyFen(user.cashBalance ?? 0)}</span></span>
                    <span>赠点：<span className="info-value">{formatMoneyFen(user.bonusBalance ?? 0)}</span></span>
                </div>
                <p>{<span>近30天消费：<span className="info-value">{formatMoneyFen(recent30dSpent)}</span></span> }{ recent30dSpent > 25000 && <span>，您真壕！</span> }</p>
            </div>
            { userPass && <PassLiteCard /> }
            <div className="master-width windowlike generic-vert-grid">
                <div className="bipartite">
                    <div>
                        <EnterButton disabled={notInVenue && (user.balance >= admissionBalance || user.chargeMultiplier == 0) ? false : true} />
                        <div>在店时长：<br/>
                        {condStayTimer}<br/>
                        
                        当前费用：<br/>
                        {condChargeTimer}<br/></div>
                        <LeaveButton disabled={notInVenue ? true : false} />
                    </div>

                    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {currentVisit?.token ?<div className="entranceQr">
                            <QRCodeSVG 
                                value={currentVisit?.token}
                                size={160}
                                marginSize={4}
                            />
                        </div> :
                        <div className="entranceQr" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", writingMode: "vertical-rl" }}>
                            <b style={{ fontSize: "1.6rem", textAlign: "center"}}>进店后启用<br/>离店前有效</b>
                        </div>}
                    </div>
                    
                </div>
            </div>
            <div className="master-width windowlike">
                {announcements.message4All.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
                {user.balance >= admissionBalance && announcements.message4Paid.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
            </div>
        </main>
    );
}
