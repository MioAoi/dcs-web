export function calculateCharge (
    enterTime: Date,
    leaveTime: Date,
    rater: (time: number, states: { rate: number, gauge: number }) => { rate: number, gauge: number }
): {
    total: number;
    priceDetail: string;
    endStates: { rate: number, gauge: number };
} {
    let states = {
        rate: 0,
        gauge: 0
    }
    let currTime = enterTime.getTime();
    let total = 0;
    let priceDetailArr: string[] = []
    while (currTime < leaveTime.getTime()) {
        states = rater(currTime, states);
        total += states.rate;
        if (priceDetailArr.at(-1)?.split('*')[0] === String(states.rate)) {
            const [lastRate, lastCount] = priceDetailArr.at(-1)!.split('*').map(Number);
            priceDetailArr[priceDetailArr.length - 1] = `${lastRate}*${lastCount + 1}`;
        } else {
            priceDetailArr.push(`${states.rate}*1`);
        }

        currTime += 60000;
    }
    return {
        total,
        priceDetail: priceDetailArr.join('+'),
        endStates: states
    };
}
