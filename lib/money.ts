export function formatMoneyFen(fen: number) {
    if (fen < 1000000) {
        return "\u00a5" + (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 100).toFixed(2);
    } else {
        return "\u00a5" + (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 1000000).toFixed(1) + "万";
    }
}

export function formatRatioZhe(ratio: number) {
    let rawNumber = Math.round(ratio * 100);
    return Math.floor(rawNumber / 10).toString() + (rawNumber % 10 != 0 ? "." + (rawNumber % 10).toString() : "") + "折";
}
