import { prisma } from "@/lib/prisma";
export default async function DayVisitHistogram() {
    const endHour = ((Date.now() / 3600000) | 0) * 3600000;
    const startHour = endHour - 24 * 3600000;
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
                        lte: new Date(endHour),
                    }
                },
                {
                    OR: [
                        {
                            leftAt: null
                        },
                        {
                            leftAt: {
                                gt: new Date(startHour)
                            }
                        }
                    ]
                }
            ]
        }
    });
    const buckets = Array.from({ length: 24 }, () => 0);
    function intersection(start1: number, end1: number, start2: number, end2: number) {
        return Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
    }
    for (const visit of relevantVisits) {
        for (let startTime = startHour; startTime < endHour; startTime += 3600000) {
            const endTime = startTime + 3600000;
            const hourNumber = (((startTime / 3600000) | 0) + 8) % 24;
            buckets[hourNumber] += intersection(startTime, endTime, visit.enteredAt.getTime(), visit.leftAt ? visit.leftAt.getTime() : endTime) / 3600000;
        }
    }
    const currentHourNumber = (startHour / 3600000 + 4) % 24;
    function squish(value: number) {
        return (Math.sqrt(value + 1) - 1) * 2.5;
    }
    return (
        <div className="windowlike dayVisitHistogram">
            {buckets.slice(4, 24).concat(buckets.slice(0, 4)).map((value, index) => {
                const hourNumber = index + 4;
                return (
                <div key={index} className="histogram-column">
                    <div className="plot">
                        <div className="barWithValue">
                            <span className="value">{value > 0 ? value.toFixed(2) : ""}</span>
                            <div className={"bar " + (hourNumber < 8 ? "morning" : hourNumber < 16 ? "noon" : hourNumber < 24 ? "evening" : "morning")} style={{ height: `${squish(value)}rem` }}></div>
                        </div>
                    </div>
                    <span className="label">{(hourNumber % 2 == 0 ? hourNumber : "\u3000")}</span>
                </div>
                );
            })}
            <div
                className="nowLine"
                style={{ gridColumn: `${currentHourNumber + 1}` }}
            />
        </div>
    );
}
