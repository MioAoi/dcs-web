'use client';
import { formatMoneyFen } from "@/lib/money";
import { useState } from "react";
import SvgIcon from "@/components/SvgIcon";
import { useRouter } from "next/navigation";

export default function GoodsCard({ name, dispName, price, userCashBalance }: { name: string; dispName: string; price: number, userCashBalance: number }) {
    const [amount, setAmount] = useState(1);
    const [error, setError] = useState("");
    const [buyButtonState, setBuyButtonState] = useState<"avail" | "!balance" | "done">(userCashBalance >= price ? "avail" : "!balance");
    const router = useRouter();
    async function handleBuy() {
        const response = await fetch("/api/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ goodsName: name, amount })
        });
        const result = await response.json();
        if (result.success) {
            setBuyButtonState("done");
            setTimeout(() => router.push("/shop/bought"), 3000);
        } else {
            setError(result.error || "购买失败");
        }
    }
    return (
        <div className="master-width windowlike card-goods">
            <img className="avatar" src={`/goodspics/${name.replace(".", "_")}.webp`} alt={dispName} />
            <div className="nulldiv">
                <span className="nickname">{dispName}</span><br/>
                <span className="info-value">{formatMoneyFen(price)} &#xd7; </span>
                <input style={{ width: '2.5rem' }} className="info-input" type="number" value={amount} disabled={buyButtonState === "done"} 
                onChange={e => {
                    setAmount(Math.max(Number(e.target.value), 1));
                    if (price * amount > userCashBalance) {
                        setBuyButtonState("!balance");
                    } else {
                        setBuyButtonState("avail");
                    }
                }} />
                {error ? <div className="error">{error}</div> : <span>&#x3000;</span>}
            </div>
            {buyButtonState === "avail" && <button onClick={handleBuy}>购买</button>}
            {buyButtonState === "!balance" && <button className="disabled">余额不足</button>}
            {buyButtonState === "done" && <button className="prepare"><SvgIcon name="checkmark" fill="var(--color-success-bright)"/>已购买</button>}
        </div>
    );
}
