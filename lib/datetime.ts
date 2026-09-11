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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    date.setUTCHours(0, 0, 0, 0); ms -= date.getTime();
    const hour = Math.floor(ms / 3600000); ms -= hour * 3600000;
    const minute = Math.floor(ms / 60000); ms -= minute * 60000;
    const second = Math.floor(ms / 1000); ms -= second * 1000;

    return { year, month, day, hour, minute, second, ms };
}

export function toFLTStamp(time: number): string {
    const isoString = (new Date(time + 28800000)).toISOString();
    return isoString.replace(/[^0-9]/g, '');
}

export function formatFLTToMinutes(time: number, refTime = Date.now(), relateToToday = true) {
    const flt = toFLT(time);
    const fltRef = toFLT(refTime);
    
    const hms = `${flt.hour.toString().padStart(2, '0')}:${flt.minute.toString().padStart(2, '0')}`;

    if (relateToToday) {
        // Today
        if (flt.year === fltRef.year && flt.month === fltRef.month && flt.day === fltRef.day) {
            return hms;
        }
        // Yesterday
        if (flt.year === fltRef.year && flt.month === fltRef.month && flt.day === fltRef.day - 1) {
            return "昨天 " + hms;
        }
        // Ototoi
        if (flt.year === fltRef.year && flt.month === fltRef.month && flt.day === fltRef.day - 2) {
            return "前天 " + hms;
        }

        if (time > refTime && time - refTime <= 604800000) {
            return "周" + ["日", "一", "二", "三", "四", "五", "六"][(new Date(time + 28800000 - DATE_BOUNDARY_HOUR * 3600000)).getDay()] + " " + hms;
        }
    }
    // Same day as reference
    if (flt.year === fltRef.year && flt.month === fltRef.month && flt.day === fltRef.day) {
        return hms;
    }
    // Same year
    if (flt.year === fltRef.year) {
        return `${flt.month.toString()}月${flt.day.toString()}日 ${hms}`;
    }
    // Different year
    return `${flt.year}年${flt.month.toString()}月${flt.day.toString()}日 ${hms}`;
}
