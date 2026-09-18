"use client";

import { useRouter } from "next/navigation";

export default function BuyDrinkButton({ user }: { user: { id: number } }) {
    const router = useRouter();
    async function handleBuyDrink(bank: string) {
        const { orderNo } = await (await fetch("/api/orderCoupon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                amount: 1440,
                goodsName: "几何特调",
                bank,
                returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/paytest`
            })
        })).json();
        router.push(`/pay?order=${orderNo}`);
    }

    return (
        <div className="invwindow master-width bipartite">
            <div className="Button" onClick={() => handleBuyDrink("alipay")}>
                购买一杯 &#xA5;14.4<br/>（支付宝）
            </div>
            <div className="Button accept" onClick={() => handleBuyDrink("wxpay")}>
                购买一杯 &#xA5;14.4<br/>（微信）
            </div>
        </div>
    );
}
