import { prisma } from "@/lib/prisma";
import { loadCurrentPricingv2 } from "@/lib/load";
import { toFLT } from "@/lib/datetime";
import { formatMoneyFen, formatRatioZhe } from "@/lib/money";
import { getUserPassMultiplier } from "@/lib/users";
import { calculateCharge } from "@/lib/pricingv2";
import { getCurrentVisit } from "@/lib/visits";

export default async function UserPricingSummary({ userId }: { userId: number }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return null;
    }
    const currentPricing = await loadCurrentPricingv2();
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const now = Date.now();
    
    const hypEnterTime = (await getCurrentVisit(userId))?.enteredAt ?? now;
    const segmentRate = calculateCharge(
        new Date(hypEnterTime),
        new Date(now + 60000),
        currentPricing?.rater ?? ((time, states) => states)
    ).endStates.rate;

    const userPassMultiplier = await getUserPassMultiplier(userId);
    return (
        <div className="windowlike master-width">
            <h5>当前总费率 <span className="info-value large">{formatMoneyFen(segmentRate * 60 * (user.chargeMultiplier ?? 1) * userPassMultiplier)}</span> 每时</h5>
            <div className="nulldive bipartite">
                <ul>
                    <li className={`${user.chargeMultiplier == 0 ? "strikeout" : ""}`}>时段基率 <span className={`info-value`}>{formatMoneyFen(segmentRate * 60)}</span> 每时</li>
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
