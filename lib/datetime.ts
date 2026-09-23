// FLT stands for Fixed Lyangtjoq (Liangzhu) Time i.e. UTC+8.  I'm hardcoding it, ain't implementing for any other timezone.

const DATE_BOUNDARY_HOUR = 4;
type datetime = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
};

export function toFLT(time: number): datetime {
    let ms = time + 28800000;
    let date = new Date(ms - DATE_BOUNDARY_HOUR * 3600000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    
    date.setUTCHours(0, 0, 0, 0); ms -= date.getTime();
    const hour = (ms / 3600000) | 0; ms -= hour * 3600000;
    const minute = (ms / 60000) | 0; ms -= minute * 60000;
    const second = (ms / 1000) | 0; ms -= second * 1000;

    return { year, month, day, hour, minute, second, ms };
}

export function toFLTStamp(time: number): string {
    const isoString = (new Date(time + 28800000)).toISOString();
    return isoString.replace(/[^0-9]/g, '');
}

export function dayNumber(time: number): number {
    return (time + 28800000 - DATE_BOUNDARY_HOUR * 3600000) / 86400000 | 0;
}

export function formatFLTToMinutes(time: number, dayRelative = true, refTime = Date.now()) {
    const flt = toFLT(time);
    const fltRef = toFLT(refTime);
    const hms = `${flt.hour.toString().padStart(2, '0')}:${flt.minute.toString().padStart(2, '0')}`;

    if (dayRelative) {
        // Today
        if (dayNumber(time) === dayNumber(refTime)) {
            return hms;
        }
        // Yesterday
        if (dayNumber(time) === dayNumber(refTime) - 1) {
            return "昨天 " + hms;
        }
        // Ototoi
        if (dayNumber(time) === dayNumber(refTime) - 2) {
            return "前天 " + hms;
        }
        if (dayNumber(time) > dayNumber(refTime) && dayNumber(time) < dayNumber(refTime) + 7) {
            return "周" + ["日", "一", "二", "三", "四", "五", "六"][(new Date(time + 28800000 - DATE_BOUNDARY_HOUR * 3600000)).getUTCDay()] + " " + hms;
        }
        if (flt.year === fltRef.year) {
            return `${flt.month.toString()}月${flt.day.toString().padStart(2, '\u2007')}日 ${hms}`;
        }
        return `${(flt.year)}.${flt.month.toString().padStart(2, '\u2007')}.${flt.day.toString().padStart(2, '\u2007')} ${hms}`;
    }
    
    // Non-relative, no need to make it as short as recent dates, write out 年月日
    return `${flt.year}年${flt.month.toString().padStart(2, '\u2007')}月${flt.day.toString().padStart(2, '\u2007')}日 ${hms}`;
}

export function formatRelativeFLTToMinutes(time: number, refTime: number) {
    const dayOffset = dayNumber(time) - dayNumber(refTime);
    const flt = toFLT(time);
    return (dayOffset < 0 ? `(\u2212${-dayOffset})` : dayOffset > 0 ? `(+${dayOffset})` : '') + ` ${flt.hour.toString().padStart(2, '0')}:${flt.minute.toString().padStart(2, '0')}`;
}

export function greeting(time = Date.now()): string {
    const flt = toFLT(time);
    const hour = flt.hour;
    if (hour >= 5 && hour < 12) {
        return "早上好";
    } else if (hour >= 12 && hour < 18) {
        return "下午好";
    } else {
        return "晚上好";
    }
}
