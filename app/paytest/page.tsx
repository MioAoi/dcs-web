import BuyDrinkButton from "@/app/components/BuyDrinkButton"
import { requireUserOrRedirect } from "@/lib/auth";
import { getUserCoupons } from "@/lib/users";
import { formatMoneyFen } from "@/lib/money";

export default async function Page() {
    const user = await requireUserOrRedirect();
    const coupons = await getUserCoupons(user.id);
    return (
        <main>
            <h2>购买几何特调</h2>
            <BuyDrinkButton user={user} />
            <h2>所持券码</h2>
            {coupons.map((coupon) => (
                <div className="windowlike master-width" key={coupon.id}>
                    <span className="info-value text-token">{coupon.token}</span><br/>
                    {coupon.goodsName}&#x3000;
                    <span className="info-value">{formatMoneyFen(coupon.amount)}</span>
                </div>
            ))}
        </main>
    );
}
