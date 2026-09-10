export function formatMoneyFen(fen: number) {
    if (fen < 1000000) {
        return "\u00a5" + (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 100).toFixed(2);
    } else {
        return "\u00a5" + (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 1000000).toFixed(1) + "万";
    }
}

export function formatRatioZhe(ratio: number) {
    let rawNumber = Math.round(ratio * 100);
    return Math.floor(rawNumber / 10).toString() + (rawNumber % 10 != 0 ? "." + (rawNumber % 10).toString() : "") + " 折";
}

export function formatTimeSeconds(seconds: number) {
    const secs = seconds % 60;
    const mins = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600) % 24;
    const days = Math.floor(seconds / 86400);
    if (days > 0) {
        return days.toString() + "d " + hours.toString().padStart(2, '0') + "h " + mins.toString().padStart(2, '0') + "\u2019 " + secs.toString().padStart(2, '0') + "s";
    }
    if (hours > 0) {
        return hours.toString() + "h " + mins.toString().padStart(2, '0') + "\u2019 " + secs.toString().padStart(2, '0') + "s";
    }
    if (mins > 0) {
        return mins.toString() + "\u2019 " + secs.toString().padStart(2, '0') + "s";
    }
    return secs.toString() + "s";
}
