import PlayerNavigation from "@/components/PlayerNavigation"
import { prisma } from "@/lib/prisma";
import { loadGoods } from "@/lib/load";
import { formatFLTToMinutes } from "@/lib/datetime"

export default async function BoughtPage() {
    const purchases = await prisma.purchase.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    const goods = loadGoods();
    return (
        <main>
            <PlayerNavigation buttonLogout={false} />
            <h2>已购买</h2>
            <div className="master-width invwindow">
                <p>只显示最近5件</p>
            </div>
            {purchases.map(purchase => (
                <div key={purchase.id} className="master-width windowlike card-goods">
                    <img className="avatar" src={`/goodspics/${purchase.goodsName.replace(".", "_")}.webp`} alt={goods.find(g => g.name === purchase.goodsName)?.dispName || purchase.goodsName} />
                    <div>
                        <span className="nickname">{goods.find(g => g.name === purchase.goodsName)?.dispName || purchase.goodsName}</span><br/>
                        <span className="info-value large">&#xd7;{purchase.amount}</span> 购买时间：<span className="info-value">{formatFLTToMinutes(purchase.createdAt.getTime())}</span>
                    </div>
                </div>
            ))}
        </main>
    );
}