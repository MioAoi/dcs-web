import { isWorkday } from "chinese-days";

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

    if (localDayMinutes == 1080)
        gauge = 0;

    // 基础费率
    if (localDayMinutes >= 240 && localDayMinutes < 600) {
        rate = 10;
    } else if (localDayMinutes >= 600 && localDayMinutes < 1080 && isWorkday(time)) {
        rate = 20;
    } else {
        rate = 25;
    }

    if (gauge >= 240) {
        rate /= 2;
    }
    if (gauge >= 480) {
        rate = 0;
    }
    // 费率至此确定
    
    if (localDayMinutes < 240 || localDayMinutes >= 600) 
        gauge++;

    return {
        rate,
        gauge
    }
}
