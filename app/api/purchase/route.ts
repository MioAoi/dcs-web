import { getCurrentUser } from "@/lib/auth";
import { messages } from "@/lib/messages";
import { loadGoods } from "@/lib/load";
import { prisma } from "@/lib/prisma";
import { LedgerEntryType } from "@/generated/prisma/enums";
import { updateBalanceCache } from "@/lib/balance";

export async function POST(request: Request) {
    const { goodsName, amount } = await request.json();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return Response.json({ error: messages.e401 }, { status: 401 });
    }
    const userId = currentUser.id;
    const goods = loadGoods().find(g => g.name === goodsName);
    if (!goods) {
        return Response.json({ error: messages.e404_goods }, { status: 404 });
    }
    const total = Math.abs(goods.price * amount);
    if (currentUser.cashBalance < total) {
        return Response.json({ error: messages.e402_notEnoughCash }, { status: 402 });
    }
    await prisma.$transaction(async (tx) => {
        await tx.purchase.create({
            data: {
                userId: userId,
                goodsName: goods.name,
                amount: amount,
            }
        })
        await tx.ledger.create({
            data: {
                userId: userId,
                cashChange: -total,
                note: `购买 ${goods.dispName} \u00d7${amount}`,
                type: LedgerEntryType.SHOP
            }
        })
    })
    await updateBalanceCache(currentUser.id);
    return Response.json({ success: true });
}
