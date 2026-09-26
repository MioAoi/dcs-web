"use server";
import EnterButton from "@/app/components/EnterButton";
import { getCurrentVisit } from "@/lib/visits";
import LeaveButton from "../components/LeaveButton";
import StayTimer from "../components/StayTimer";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen, formatRatioZhe } from "@/lib/money";
import ChargeTimer from "@/app/components/ChargeTimer";
import { loadCurrentPricing } from "@/lib/load";
import fs from "fs";
import { toFLT, formatFLTToMinutes, greeting } from "@/lib/datetime";
import { getInVenueCount, getUserTotalSpent } from "@/lib/users";
import { QRCodeSVG } from "qrcode.react";
import ConcatPhrases from "@/app/components/ConcatPhrases";
import PlayerNavigation from "../components/PlayerNavigation";

export default async function Dashboard() {
    const now = new Date().getTime();

    let admissionPhrases = [];

    const currentPricing = loadCurrentPricing();
    const globalDiscount = currentPricing?.globalDiscount ?? 1;
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const currentRateSegment = currentPricing?.circadyRates.find((segment: any) => {
        const nowFLT = toFLT(now);
        const nowMinute = (nowFLT.hour % 24) * 60 + nowFLT.minute;
        return nowMinute >= segment.startMinute && nowMinute < segment.endMinute;
    });
    const user = await requireUserOrRedirect();
    
    if (globalDiscount == 0) {
        admissionPhrases = [
            <span>当前免费入场</span>
        ];
    } else if (user.chargeMultiplier == 0) {
        admissionPhrases = [
            <span>您可免费入场</span>
        ];
    } else {
        admissionPhrases.push(
            <span>当前费率为 <span className="info-value">{formatMoneyFen(currentRateSegment.rate * 60 * user.chargeMultiplier * (currentRateSegment.globalDiscountApply ? globalDiscount : 1))}</span> 每时</span>
        );
        if (currentRateSegment.globalDiscountApply && globalDiscount != 1) {
            admissionPhrases.push(
                <span>已计全局折扣 <span className="info-value">{formatRatioZhe(globalDiscount)}</span></span>
            );
        }
        if  (user.chargeMultiplier != 1) {
            admissionPhrases.push(
                <span>已计个人折扣 <span className="info-value">{formatRatioZhe(user.chargeMultiplier)}</span></span>
            );
        }
    }
    const recent30dSpent = await getUserTotalSpent(user.id, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    const timeString = formatFLTToMinutes(now, false);

    const announcements: { message4All: string[], message4Paid: string[] } = JSON.parse(fs.readFileSync("profiles/announcements.json", "utf-8"));
    
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const formatBalance = formatMoneyFen(user.balance ?? 0);
    const formatBonus = formatMoneyFen(user.bonusBalance ?? 0);

    const condEnterButton = notInVenue && (user.balance >= admissionBalance || user.chargeMultiplier == 0) ? <EnterButton/> : <div className="Button disabled">进店</div>;
    const condLeaveButton = !notInVenue ? <LeaveButton/> : <div className="Button disabled">离店</div>;
    const condStayTimer = !notInVenue ? <StayTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value">不在店</span>;
    const condChargeTimer = !notInVenue ? <ChargeTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0} chargeMultiplier={user.chargeMultiplier ?? 1} pricing={currentPricing} /> : <span className="info-value"/>;

    return (
        <main>
            <PlayerNavigation buttonManage={user.role === "STAFF" || user.role === "ADMIN"} buttonLogout={true} />
            <div className="master-width invwindow split">
                <span>{greeting()}，{displayName}</span>
                <span className="info-value bear-right">{timeString}</span>
            </div>
            <div className="master-width windowlike">
                <ConcatPhrases phrases={admissionPhrases} />
                <p>{ recent30dSpent > 0 && <span>近30天消费：<span className="info-value">{formatMoneyFen(recent30dSpent)}</span></span> }{ recent30dSpent > 30000 && <span>，您真壕！</span> }</p>
            </div>
            <div className="master-width windowlike">
                {announcements.message4All.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
                {user.balance >= admissionBalance && announcements.message4Paid.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
            </div>
            <div className="master-width windowlike">
                当前余额 <span className={user.balance >= admissionBalance ? "info-value" : "money-owe"}>{formatBalance}</span>，
                含赠点 <span className="info-value">{formatBonus}</span>。
            </div>

            <div className="master-width windowlike generic-vert-grid">
                <div className="visit-time-and-qr">
                    <div>
                        <div>在店时长：
                        {condStayTimer}<br/>
                        
                        当前费用：
                        {condChargeTimer}<br/></div>
                    </div>

                    <div>
                        {currentVisit?.token ?<>
                            <QRCodeSVG value={currentVisit?.token} />
                            <p>本次离店前有效</p>
                        </> : null}
                    </div>
                    
                </div>
                <div className="bipartite">
                    {condEnterButton}
                    {condLeaveButton}
                </div>
            </div>
        </main>
    );
}
