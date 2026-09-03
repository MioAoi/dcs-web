export function formatMoneyFen(fen: number) {
    if (fen < 1000000) {
        return (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 100).toFixed(2) + "元";
    } else {
        return (fen < 0 ? "\u2212" : "") + (Math.abs(fen) / 1000000).toFixed(1) + "万元";
    }
}
