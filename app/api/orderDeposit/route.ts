import { initiatePayment } from "@/lib/payment"
import { getUserAvailDepositDiets } from "@/lib/users";

export async function POST(request: Request) {
    const { userId, dietName, bank } = await request.json();
    const diets = await getUserAvailDepositDiets(userId);
    const diet = diets.find((d: { name: string }) => d.name === dietName);
    if (!diet) {
        return new Response(JSON.stringify({ error: "Diet not found" }), { status: 404 });
    }

    const result = await initiatePayment({
        userId,
        amount: diet.cash,
        purpose: 'DEPOSIT',
        goodsName: dietName,
        bank,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });
    if (result.success) {
        return Response.json({ orderNo: result.orderNo });
    } else {
        return Response.json({ error: "内部错误" }, { status: 500 });
    }
}
