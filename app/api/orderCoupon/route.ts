import { initiatePayment } from "@/lib/payment"

export async function POST(request: Request) {
    const { userId, amount, goodsName, bank, returnUrl } = await request.json();
    const result = await initiatePayment({
        userId,
        amount,
        purpose: "OTHER",
        bank,
        goodsName,
        returnUrl
    });
    if (result.success) {
        return Response.json({ orderNo: result.orderNo });
    } else {
        return Response.json({ error: "内部错误" }, { status: 500 });
    }
}
