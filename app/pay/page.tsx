import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";

export default async function PayPage({ searchParams }: { searchParams: Promise<{ order: string }>}) {
    const { order } = await searchParams;
    const paymentOrder = await prisma.paymentOrder.findUnique({
        where: {
            orderNo: order
        }
    });
    if (!paymentOrder) {
        return (
            <main>
                <h2>支付页面</h2>
                <p>订单号: {order}</p>
                <p>未找到对应的支付订单。</p>
            </main>
        );
    }
    if (paymentOrder.status === "PAID") {
        return (
            <main>
                <h2>支付页面</h2>
                <p>订单号: {order}</p>
                <p>该订单已支付。</p>
            </main>
        );
    }
    if (paymentOrder.payDirection == "url") {
        // redirect
        if (paymentOrder.bill) {
            window.location.href = paymentOrder.bill;
            return null;
        }
    }
    if (paymentOrder.payDirection == "qrcode") {
        if (paymentOrder.bill) {
            return (
                <main>
                    <h2>支付页面</h2>
                    <p>实需支付（含手续费）: <span className="info-value">{paymentOrder.amountWcms}元</span></p>
                    <QRCodeSVG value={paymentOrder.bill} />
                </main>
            );
        }
    }

    return (
        <main>
            <h2>支付页面</h2>
            <p>订单号:{order}</p>
            {JSON.stringify(paymentOrder)}
        </main>
    );
}
