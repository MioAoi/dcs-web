import { formatMoneyFen } from "./money";

// 费率均为分钱每分钟
const CIRCADY_RATES = [
    {   // 日首平价
        startMinute: 0,
        endMinute: 240,
        maxout: null,
        rate: 25,
        globalDiscountApply: true,
    },
    {   // 舞萌维护期+早鸟激励
        startMinute: 240,
        endMinute: 600,
        maxout: null,
        rate: 10,
        globalDiscountApply: false,
    },
    {   // 白天4小时封顶
        startMinute: 600,
        endMinute: 1320,
        maxout: 240,
        rate: 25,
        globalDiscountApply: true,
    },
    {   // 黄金两小时
        startMinute: 1320,
        endMinute: 1440,
        maxout: null,
        rate: 30,
        globalDiscountApply: true,
    }
]

const GLOBAL_DISCOUNT = 0.7;

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
    leaveTime: Date
) {
    if (leaveTime <= enterTime) return { total: 0, priceDetail: "" };

    // Convert times to day-minute form
    const enterMinute = enterTime.getHours() * 60 + enterTime.getMinutes();
    const leaveMinute = leaveTime.getHours() * 60 + leaveTime.getMinutes();

    let total = 0;
    let priceDetail = "";
    let cursorDate = new Date(enterTime.getTime());
    let cursorMinute = enterMinute;

    while (true) {
        let currentSegment = CIRCADY_RATES.find(segment => cursorMinute >= segment.startMinute && cursorMinute < segment.endMinute);
        if (!currentSegment) break;
        if (isSameShanghaiDay(cursorDate, leaveTime) && leaveMinute <= currentSegment.endMinute) {
            const duration = leaveMinute - cursorMinute;
            const segmentTotal = Math.min(duration, currentSegment.maxout ?? duration) * currentSegment.rate * (currentSegment.globalDiscountApply ? GLOBAL_DISCOUNT : 1);
            total += segmentTotal;
            priceDetail += formatTimeMinutes(cursorMinute) + " 至 " + formatTimeMinutes(leaveMinute) + " 共 " + formatMoneyFen(segmentTotal) + "\n";
            break;
        } else {
            const nextMinute = currentSegment.endMinute;
            const duration = nextMinute - cursorMinute;
            const segmentTotal = Math.min(duration, currentSegment.maxout ?? duration) * currentSegment.rate * (currentSegment.globalDiscountApply ? GLOBAL_DISCOUNT : 1);
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

export function formatTimeMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
}
