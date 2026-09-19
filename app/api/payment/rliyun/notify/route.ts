import { prisma } from "@/lib/prisma";
import type { LedgerEntryType } from "@/generated/prisma/enums";
import fs from "fs";
import { bytesToBase260 } from "@/lib/base260";
import crypto from "crypto";
import { updateBalanceCache } from "@/lib/balance";

const depositDiets = JSON.parse(fs.readFileSync("profiles/deposit_diets.json", "utf-8"));

export async function POST(request: Request) {
    const formData = await request.formData();
    const trade_status = formData.get("trade_status");
    const out_trade_no = (formData.get("out_trade_no") as string);
    const name = formData.get("name");
    
    if (trade_status === "TRADE_SUCCESS") {
        const order = await prisma.paymentOrder.findUnique({
            where: {
                orderNo: out_trade_no
            }
        });
        if (!order) {
            return Response.json({ success: false });
        }
        if (order.status === 'PAID') {
            return Response.json({ success: false });
        }
        const { purpose, goodsName } = order;
        await prisma.$transaction(async (tx) => {
            await tx.paymentOrder.update({
                where: {
                    orderNo: out_trade_no
                },
                data: {
                    status: 'PAID',
                    paidAt: new Date()
                }
            });
            if (purpose === 'DEPOSIT') {
                const { cash, bonus } = depositDiets.find((diet: { name: string; cash: number; bonus: number }) => diet.name === goodsName) || {};
                await tx.ledger.create({
                    data: {
                        userId: order.userId,
                        cashChange: cash || 0,
                        bonusChange: bonus || 0,
                        type: 'DEPOSIT' as LedgerEntryType,
                        note: `充值: ${goodsName}`,
                        paymentOrderId: order.id,

                        deposit: {
                            create: {
                                userId: order.userId,
                                paymentOrderId: order.id,
                                dietName: goodsName
                            }
                        }
                    }
                });
            } else {
                await tx.coupon.create({
                    data: {
                        userId: order.userId,
                        goodsName: goodsName,
                        token: bytesToBase260(crypto.randomBytes(16)),
                        amount: order.amount,
                    }
                });
            }
        });
        await updateBalanceCache(order.userId);
        return Response.json({ success: true });
    }
    return Response.json({ success: false });
}
