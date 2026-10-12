import { prisma } from "@/lib/prisma";
import NavigateButton from "@/components/NavigateButton";
import { QRCodeSVG } from "qrcode.react";
import PlayerNavigation from "@/components/PlayerNavigation";

export default async function PayPage({ searchParams }: { searchParams: Promise<{ order: string }>}) {
    const { order } = await searchParams;
    const errorPage = (
        <main>
            <PlayerNavigation buttonLogout={false} buttonManage={false}/>
            <h2>支付页面</h2>
            <div className="master-width windowlike">
                <p>可能的错误原因：</p>
                <ul>
                    <li>我们的支付通道掉线了</li>
                    <li>支付服务的提供者掉链子了</li>
                    <li>您输入了错误的订单号</li>
                </ul>
            </div>
        </main>
    )
    if (!order) {
        return errorPage;
    }
    const paymentOrder = await prisma.paymentOrder.findUnique({
        where: {
            orderNo: order
        }
    });
    if (!paymentOrder) {
        return errorPage;
    }
    if (paymentOrder.status === "PAID") {
        return (
            <main>
                <PlayerNavigation buttonLogout={false} buttonManage={false}/>
                <h2>支付页面</h2>
                <div className="master-width windowlike">
                    订单号：<br/>
                    <span className="info-value text-token">{order}</span>
                </div>
            </main>
        );
    }
    if (!paymentOrder.bill) {
        return errorPage;
    }
    return (
        <main>
            <PlayerNavigation buttonLogout={false} buttonManage={false}/>
            <h2>支付页面</h2>
            <div className="master-width windowlike">
                订单号：<br/>
                <span className="info-value text-token">{order}</span>
            </div>
            <div className="master-width windowlike">
                有时收款服务会收取数分钱的手续费，请一定确认

                <h3>实际需付金额</h3>
                <div className="info-value" style={{ fontSize: "2rem", textAlign: "center" }}>
                    &#xa5;{paymentOrder.amountWcms}
                </div>
                也请尽快支付。金额不一致或支付超时都会导致无法自动到账。
                { paymentOrder.payDirection == "url" ? (
                    <div style={{ marginTop: "0.25rem" }}>
                        <NavigateButton href={paymentOrder.bill} buttonText="去支付" buttonColor="primary"/>
                    </div>
                )
                : paymentOrder.payDirection == "qrcode" ? (
                    <QRCodeSVG value={paymentOrder.bill} />
                )
                : <p>不知为何我们现在无法给您支付指示，但您可以将以下信息提供给工作人员：<br/>{JSON.stringify(paymentOrder)}</p>}
            </div>
        </main>
    );
}
