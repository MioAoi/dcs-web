export default function Rater(
    time: number,
    states: {
        rate: number,
        gauge: number
    }
): {
    rate: number,
    gauge: number
} {
    const localDayMinutes = (((time / 60000) | 0) + 480) % 1440;
    let rate = states.rate || 0;
    let gauge = states.gauge || 0;

    if (localDayMinutes == 1320)
        gauge = 0;

    // 基础费率
    if (localDayMinutes >= 240 && localDayMinutes < 600) {
        rate = 10;
    } else if (localDayMinutes >= 1320) {
        rate = 21;
    } else {
        rate = 17.5;
    }

    if (gauge >= 240) {
        rate = 0;
    }
    // 费率至此确定

    // 更新封顶槽
    
    if (localDayMinutes > 600 && localDayMinutes < 1320)
        gauge++;

    return {
        rate,
        gauge
    }
}
