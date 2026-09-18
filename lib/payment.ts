
import type { PaymentPurpose, PaymentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function makeSign(
    params: Record<string, string>
) {
    const signingString = Object.entries(params)
    .filter(([k, v]) =>
        k !== "sign" &&
        k !== "sign_type" &&
        v !== ""
    )
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

    return crypto
        .createHash("md5")
        .update(signingString + process.env.MERCHANT_KEY, "utf8")
        .digest("hex");
}

export async function initiatePayment({ userId, amount, purpose, bank, goodsName, returnUrl }: {
    userId: number,
    amount: number, 
    purpose: PaymentPurpose,
    bank: string,
    goodsName: string,
    returnUrl: string,
}) {
    const orderNo = crypto.randomBytes(16).toString("hex");
    await prisma.paymentOrder.create({
        data: {
            amount,
            userId,
            purpose,
            goodsName,
            orderNo,
            status: 'PENDING' as PaymentStatus,
            provider: "rliyun"
        }
    })
    const amountInYuanString = (amount / 100).toFixed(2);
    const params = {
        pid: process.env.MERCHANT_ID!.toString(),
        type: bank,
        out_trade_no: orderNo,
        name: goodsName,
        money: amountInYuanString,
        notify_url: process.env.NOTIFY_URL!,
        device: "mobile",
        return_url: returnUrl,
    }
    const response = await fetch("https://pay.rliyun.cn/xpay/epay/mapi.php", {
        method: "POST",
        body: JSON.stringify({
            ...params,
            sign: makeSign(params),
        })
    })
    const result = await response.json();
    if (result.code === 1) {
        if (result.qrcode) {
            await prisma.paymentOrder.update({
                where: { orderNo },
                data: { 
                    payDirection: "qrcode", 
                    bill: result.qrcode,
                    amountWcms: result.money
                }
            });
        } else if (result.payurl) {
            await prisma.paymentOrder.update({
                where: { orderNo },
                data: { 
                    payDirection: "url", 
                    bill: result.payurl,
                    amountWcms: result.money
                }
            });
        } else if (result.urlscheme) {
            await prisma.paymentOrder.update({
                where: { orderNo },
                data: { 
                    payDirection: "url", 
                    bill: result.urlscheme,
                    amountWcms: result.money
                }
            });
        }
        return { success: true, orderNo };
    }
    return { success: false };
}
