"use server";
import NavigateButton from "@/app/components/NavigateButton";
import LogoutButton from "@/app/components/LogoutButton";
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
import { getInVenueCount } from "@/lib/users";
import { QRCodeSVG } from "qrcode.react";
import ConcatPhrases from "@/app/components/ConcatPhrases";

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


    const timeString = formatFLTToMinutes(now, false);

    const announcements: { message4All: string[], message4Paid: string[] } = JSON.parse(fs.readFileSync("profiles/announcements.json", "utf-8"));
    
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const formatBalance = formatMoneyFen(user.balance ?? 0);
    const formatBonus = formatMoneyFen(user.bonusBalance ?? 0);
    const inVenueCount = await getInVenueCount();

    const condManageButton = user.role === "STAFF" || user.role === "ADMIN" ? (
        <NavigateButton href="/manage" buttonText=">管理页" buttonColor="action2"/>
    ) : null;
    const condEnterButton = notInVenue && (user.balance >= admissionBalance || user.chargeMultiplier == 0) ? <EnterButton/> : <div className="Button disabled">进店</div>;
    const condLeaveButton = !notInVenue ? <LeaveButton/> : <div className="Button disabled">离店</div>;
    const condStayTimer = !notInVenue ? <StayTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0}/> : <span className="info-value">不在店</span>;
    const condChargeTimer = !notInVenue ? <ChargeTimer enterTime={currentVisit?.enteredAt?.getTime() ?? 0} chargeMultiplier={user.chargeMultiplier ?? 1} pricing={currentPricing} /> : <span className="info-value"/>;

    const webDepositUsable = (fs.readFileSync("站内充值可用否.txt", "utf8").charAt(0) === "y");

    return (
        <main>
            <div className="master-width invwindow split">
                <span>{greeting()}，{displayName}</span>
                <span className="info-value-small bear-right">{timeString}</span>
            </div>
            <div className="master-width windowlike">
                <ConcatPhrases phrases={admissionPhrases} />
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
                含赠点 <span className="info-value-small">{formatBonus}</span>。
            </div>
            <div className="master-width windowlike bipartite">
                <div>
                    几？<br/>
                    <span className="customer-count">{inVenueCount.customers}p</span>
                    {inVenueCount.staffs > 0 ? <span className="staff-count">&nbsp;+{inVenueCount.staffs}s</span> : null}
                </div>
                <NavigateButton href="/whosin" buttonText="谁？" />
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
            <div className="master-width invwindow generic-vert-grid">
                <div className="bipartite">
                    <NavigateButton href="/selfinfo" buttonText="个人信息" />
                    {webDepositUsable ? <NavigateButton href="/deposit" buttonText="去充值" /> : <button className="disabled">去充值</button>}
                </div>
                <div className="bipartite">
                    <LogoutButton/>
                    {condManageButton}
                </div>
            </div>
        </main>
    );
}
