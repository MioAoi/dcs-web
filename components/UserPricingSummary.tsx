import { prisma } from "@/lib/prisma";
import { loadCurrentPricing } from "@/lib/load";
import { toFLT } from "@/lib/datetime";
import { formatMoneyFen, formatRatioZhe } from "@/lib/money";
import { getUserPassMultiplier } from "@/lib/users";

export default async function UserPricingSummary({ userId }: { userId: number }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return null;
    }
    const currentPricing = loadCurrentPricing();
    const globalDiscount = currentPricing?.globalDiscount ?? 1;
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const now = Date.now();
    const currentRateSegment = currentPricing?.circadyRates.find((segment: any) => {
        const nowFLT = toFLT(now);
        const nowMinute = (nowFLT.hour % 24) * 60 + nowFLT.minute;
        return nowMinute >= segment.startMinute && nowMinute < segment.endMinute;
    });
    const userPassMultiplier = await getUserPassMultiplier(userId);
    return (
        <div className="windowlike master-width">
            <h5>当前总费率 <span className="info-value large">{formatMoneyFen((currentRateSegment?.rate ?? 0) * 60 * (currentRateSegment?.globalDiscountApply ? (globalDiscount ?? 1) : 1) * (user.chargeMultiplier ?? 1) * userPassMultiplier)}</span> 每时</h5>
            <div className="nulldive bipartite">
                <ul>
                    <li className={`${user.chargeMultiplier == 0 ? "strikeout" : ""}`}>时段基率 <span className={`info-value`}>{formatMoneyFen((currentRateSegment?.rate ?? 0) * 60)}</span> 每时</li>
                    { !currentRateSegment?.globalDiscountApply ?
                    <li className="disabled">全局折扣不适用时段</li> :
                    globalDiscount == 1 ?
                    <li className="disabled">当前无全局折扣</li> :
                    <li className={`${user.chargeMultiplier == 0 ? "strikeout" : ""}`}>当前全局折扣 <span className="info-value">{formatRatioZhe(globalDiscount)}</span></li> }
                    <li className={`${user.chargeMultiplier == 0 ? "strikeout" : admissionBalance == 0 ? "disabled" : ""}`}>进店最低余额 <span className="info-value">{formatMoneyFen(admissionBalance)}</span></li>
                    
                </ul>
                <ul>
                    <li className={`${user.chargeMultiplier == 1 ? "disabled" : ""}`}>个人基倍率 <span className="info-value">{formatRatioZhe(user.chargeMultiplier ?? 1)}</span></li>
                    { userPassMultiplier != 1 &&
                    <li className={`${user.chargeMultiplier == 0 ? "strikeout" : ""}`}>DCPass 倍率 <span className="info-value">{formatRatioZhe(userPassMultiplier)}</span></li> }
                </ul>
            </div>
        </div>
    )
}
