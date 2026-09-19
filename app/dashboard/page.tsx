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
import { formatFLTToMinutes, greeting } from "@/lib/datetime";
import { getInVenueCount } from "@/lib/users";
import { QRCodeSVG } from "qrcode.react";

export default async function Dashboard() {
    const currentPricing = loadCurrentPricing();
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const currentRateSegment = currentPricing?.circadyRates.find((segment: any) => {
        const now = new Date();
        const nowMinute = now.getHours() * 60 + now.getMinutes();
        return nowMinute >= segment.startMinute && nowMinute < segment.endMinute;
    });
    const globalDiscount = currentPricing?.globalDiscount ?? 1;
    const globalDiscountInfo = (globalDiscount < 1 && currentRateSegment?.globalDiscountApply || globalDiscount == 0) ? (<>，已计全局折扣 <span className="info-value">{formatRatioZhe(globalDiscount)}</span></>) : "";
    const currentRate = (currentRateSegment?.rate ?? 0) * (currentRateSegment?.globalDiscountApply ? globalDiscount : 1);

    const announcements: { message4All: string[], message4Paid: string[] } = JSON.parse(fs.readFileSync("profiles/announcements.json", "utf-8"));
    const now = new Date().getTime();
    const timeString = formatFLTToMinutes(now, false);

    const user = await requireUserOrRedirect();
    const displayName = user.nickname || user.username || "棍母";
    const personalDiscountInfo = (user.chargeMultiplier == 1) ? (<>{`，未计个人倍率 `}<span className="info-value">{Math.round((user.chargeMultiplier ?? 1) * 100)}&#x25;</span></>) : "";

    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const formatBalance = formatMoneyFen(user.balance ?? 0);
    const formatBonus = formatMoneyFen(user.bonusBalance ?? 0);
    const inVenueCount = await getInVenueCount();

    const condManageButton = user.role === "STAFF" || user.role === "ADMIN" ? (
        <NavigateButton href="/manage" buttonText="▶管理页" />
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
                进店最低余额为 <span className="info-value-small">{formatMoneyFen(admissionBalance, false)}</span>，
                时段费率为 <span className="info-value">{formatMoneyFen(currentRate * 60)}</span>&#x2215;时
                {globalDiscountInfo}
                {personalDiscountInfo}.
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
                当前余额 <span className="info-value">{formatBalance}</span>，
                含赠点 <span className="info-value-small">{formatBonus}</span>。
            </div>
            <div className="master-width windowlike bipartite">
                <span>几？<br/>
                <span className="info-value">{inVenueCount}</span></span>
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
                <LogoutButton/>
                {condManageButton}
            </div>
        </main>
    );
}
