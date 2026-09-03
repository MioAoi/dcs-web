import { prisma } from "@/lib/prisma";
import { LedgerEntryType } from "@/generated/prisma/enums";

export async function changeBalance(userId: number, cashDelta: number, bonusDelta: number, note: string) {
    await prisma.ledger.create({
        data: {
            userId: userId,
            cashChange: cashDelta,
            bonusChange: bonusDelta,
            note: note,
            type: LedgerEntryType.MANUAL
        },
    });
    await updateBalanceCache(userId);
}

export async function updateBalanceCache(userId: number) {
    const result = await prisma.ledger.aggregate({
        where: { userId: userId },
        _sum: {
            cashChange: true,
            bonusChange: true,
        },
    });
    await prisma.user.update({
        where: { id: userId },
        data: {
            cashBalance: result._sum.cashChange ?? 0,
            bonusBalance: result._sum.bonusChange ?? 0,
            balance: (result._sum.cashChange ?? 0) + (result._sum.bonusChange ?? 0)
        }
    });
}
