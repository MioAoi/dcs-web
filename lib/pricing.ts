import { formatMoneyFen } from "./money";

type RateSegment = {
    startMinute: number;
    endMinute: number;
    rate: number;
    maxout?: number;
    globalDiscountApply?: boolean;
};

function isSameShanghaiDay(date1: Date, date2: Date) {
    const date1o = new Date(date1.getTime() + 28800000);
    const date2o = new Date(date2.getTime() + 28800000);
    if (date1o.getUTCFullYear() !== date2o.getUTCFullYear()) return false;
    if (date1o.getUTCMonth() !== date2o.getUTCMonth()) return false;
    if (date1o.getUTCDate() !== date2o.getUTCDate()) return false;
    return true;
}

export function calculateCharge (
    enterTime: Date,
    leaveTime: Date,
    pricing: {
        circadyRates: RateSegment[];
        globalDiscount: number;
    }
) {
    const { circadyRates, globalDiscount } = pricing;

    function formatTimeMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const mins = String(minutes % 60).padStart(2, "0");
        return `${hours}:${mins}`;
    }

    if (leaveTime <= enterTime) return { total: 0, priceDetail: "" };

    // Convert times to day-minute form
    const enterMinute = enterTime.getHours() * 60 + enterTime.getMinutes();
    const leaveMinute = leaveTime.getHours() * 60 + leaveTime.getMinutes();

    let total = 0;
    let priceDetail = "";
    let cursorDate = new Date(enterTime.getTime());
    let cursorMinute = enterMinute;

    while (true) {
        let currentSegment = circadyRates.find((segment: RateSegment) => cursorMinute >= segment.startMinute && cursorMinute < segment.endMinute);
        if (!currentSegment) break;
        if (isSameShanghaiDay(cursorDate, leaveTime) && leaveMinute <= currentSegment.endMinute) {
            const duration = leaveMinute - cursorMinute;
            const segmentTotal = Math.min(duration, currentSegment.maxout ?? duration) * currentSegment.rate * (currentSegment.globalDiscountApply || globalDiscount == 0 ? globalDiscount : 1);
            total += segmentTotal;
            priceDetail += formatTimeMinutes(cursorMinute) + " 至 " + formatTimeMinutes(leaveMinute) + " 共 " + formatMoneyFen(segmentTotal) + "\n";
            break;
        } else {
            const nextMinute = currentSegment.endMinute;
            const duration = nextMinute - cursorMinute;
            const segmentTotal = Math.min(duration, currentSegment.maxout ?? duration) * currentSegment.rate * (currentSegment.globalDiscountApply || globalDiscount == 0 ? globalDiscount : 1);
            total += segmentTotal;
            priceDetail += formatTimeMinutes(cursorMinute) + " 至 " + formatTimeMinutes(nextMinute) + " 共 " + formatMoneyFen(segmentTotal) + "\n";
            cursorMinute = nextMinute;
            if (cursorMinute >= 1440) {
                cursorMinute = 0;
                cursorDate = new Date(cursorDate.getTime() + 86400000);
            }
        }
    }
    return { total, priceDetail };
}
