import PlayerNavigation from "@/components/PlayerNavigation"
import { loadGoods } from "@/lib/load";
import GoodsCard from "@/components/GoodsCard";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen } from "@/lib/money";
import NavigateButton from "@/components/NavigateButton";

export default async function ShopPage() {
    const user = await requireUserOrRedirect();
    return (
        <main>
        <PlayerNavigation buttonLogout={true} />
        <div className="master-width invwindow bipartite">
            <h2>商城</h2>
            <NavigateButton href="/shop/bought" buttonText="查看已购买" buttonColor="action1"/>

        </div>
        
        <div className="master-width windowlike">
            <p>只能使用现金余额购买。当前余额：<span className="info-value">{formatMoneyFen(user.cashBalance)}</span></p>
        </div>
        <div className="goods-grid">
            {loadGoods().map(goods => (
                <GoodsCard key={goods.name} name={goods.name} dispName={goods.dispName} price={goods.price} userCashBalance={user.cashBalance} />
            ))}
        </div>
        </main>
    );
}