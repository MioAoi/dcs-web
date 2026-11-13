export default function WeekdayRater(
    timeInMinutes: number,
    states: {
        rate: number,
        gauge: number
    }
): { 
    rate: number,
    gauge: number
} {
    const localDayMinutes = (timeInMinutes + 480) % 1440;
    let rate = states.rate || 0;
    let gauge = states.gauge || 0;

    // 基础费率
    if (localDayMinutes >= 240 && localDayMinutes < 600) {
        rate = 10;
    } else if (localDayMinutes >= 600 && localDayMinutes < 1080) {
        rate = 20;
    } else {
        rate = 25;
    }

    // 根据封顶槽确定本分钟费率，之后再加槽
    if (gauge >= 240) {
        rate /= 2;
    }
    if (gauge >= 480) {
        rate = 0;
    }

    // 更新封顶槽
    if (localDayMinutes == 1080) {
        gauge = 0;
    } else {
        gauge++;
    }

    return {
        rate,
        gauge
    }
}
