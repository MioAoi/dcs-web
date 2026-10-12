import { prisma } from "@/lib/prisma";
export default async function WeekVisitHistogram() {
    const endShift = ((Date.now() / 28800000) | 0) * 28800000;
    const startShift = endShift - 21 * 28800000;
    const relevantVisits = await prisma.visit.findMany({
        where: {
            AND: [
                {
                    user: {
                        role: "CUSTOMER"
                    }
                },
                {
                    enteredAt: {
                        lte: new Date(endShift),
                    }
                },
                {
                    OR: [
                        {
                            leftAt: null
                        },
                        {
                            leftAt: {
                                gt: new Date(startShift)
                            }
                        }
                    ]
                }
            ]  
        }
    });
    const buckets = Array.from({ length: 21 }, () => 0);
    function intersection(start1: number, end1: number, start2: number, end2: number) {
        return Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
    }
    // 1st Jan 1970 is Thursday, the shift from that 8am is index 13 of week
    for (const visit of relevantVisits) {
        for (let startTime = startShift; startTime < endShift; startTime += 28800000) {
            const endTime = startTime + 28800000;
            const shiftNumber = (((startTime / 28800000) | 0) + 13) % 21;
            buckets[shiftNumber] += intersection(startTime, endTime, visit.enteredAt.getTime(), visit.leftAt ? visit.leftAt.getTime() : endTime) / 3600000;
        }
    }
    const currentShift = (((Date.now() / 28800000) | 0) + 13) % 21;
    function squish(value: number) {
        return (Math.sqrt((value / 4) + 1) - 1) * 2.5;
    }
    return (
        <div className="windowlike weekVisitHistogram">
            {buckets.map((value, index) => {
                const weekdayLabel = (index % 3 == 1 ? ["日", "月", "火", "水", "木", "金", "土"][(index / 3 | 0) % 7] : "\u3000");
                return (
                    <div key={index} className="histogram-column">
                        <div className="plot">
                            <div className="barWithValue">
                                <div className="value">{(value > 0 ? value.toFixed(2) : "")}</div>
                                <div className={"bar " + (index % 3 === 0 ? "morning" : index % 3 === 1 ? "noon" : "evening")} style={{ height: `${squish(value)}rem` }}></div>
                            </div>
                        </div>
                        <span className="label">{weekdayLabel}</span>
                    </div>
                );
            })}
            <div
                className="nowLine"
                style={{ gridColumn: `${currentShift + 1}` }}
            />
        </div>
    )
}
