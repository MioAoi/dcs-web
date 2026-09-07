import { prisma } from "@/lib/prisma";
import { calculateCharge } from "@/lib/pricing";
import { LedgerEntryType } from "@/generated/prisma/enums";
import { updateBalanceCache } from "@/lib/balance";

export async function getCurrentVisit(userID: number) {
    return await prisma.visit.findFirst({
        where: {
            userId: userID,
            leftAt: null,
        },
    });
}

export async function getLastVisitDuration(userID: number) {
    const lastVisit = await prisma.visit.findFirst({
        where: {
            userId: userID,
            leftAt: {not: null,
            },
        },
        orderBy: {
            leftAt: "desc",
        },
    });
    if (!lastVisit || !lastVisit.leftAt) return null;
    return lastVisit.leftAt.getTime() - lastVisit.enteredAt.getTime();
}

export async function completeVisit(userId: number) {
    return await prisma.$transaction(async (tx) => {
        const visit = await tx.visit.findFirst({
            where: {
                userId: userId,
                leftAt: null,
            }, orderBy: {
                enteredAt: "desc"
            }, include: {
                user: true
            }
        })
        if (!visit) throw new Error("No open visit found");
        
        const leftAt = new Date();
        const charge = calculateCharge(visit.enteredAt, leftAt).total * (visit.user.chargeMultiplier ?? 1);

        const bonusChange = -Math.min(charge, visit.user.bonusBalance);
        const cashChange = -(charge + bonusChange);

        await tx.ledger.create({
            data: {
                userId: userId,
                cashChange: cashChange,
                bonusChange: bonusChange,
                note: "离店扣费",
                type: LedgerEntryType.VISIT_CHARGE
            }
        });

        await tx.visit.update({
            where: {
                id: visit.id,
            },
            data: {
                leftAt: leftAt,
                charge: charge,
            },
        });
        await updateBalanceCache(userId);
    });
}
