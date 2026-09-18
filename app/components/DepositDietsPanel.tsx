"use client";
import { formatMoneyFen } from "@/lib/money"
import { useState } from "react";
import { toFLTStamp } from "@/lib/datetime"
import { formatFLTToMinutes } from "@/lib/datetime"
import { useRouter } from "next/navigation";

export default function DepositDietsPanel({
    userId,
    diets,
    manual,
}: {
    userId: number,
    diets: {
        name: string;
        availFrom: string | null;
        availTill: string | null;
        cash: number;
        bonus: number;
        remaining: number | null;
    }[],
    manual: boolean;
}) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    // precompute date part as default for manual timestamp input
    const now = new Date();
    const todayString = toFLTStamp(now.getTime()).slice(0, 8);

    async function handleManualDepositSubmit({ userId, dietName, manualTimeStamp } : { userId: number, dietName: string, manualTimeStamp: string }) {
        const response = await fetch('/api/manualDeposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, dietName, manualTimeStamp })
        });
        const result = await response.json();
        if (result.success) {
            setError("");
            setMessage("充值成功，3秒后刷新");
            setTimeout(() => location.reload(), 3000);
        } else {
            setError(result.error);
            setMessage("");
        }
    }

    const router = useRouter();
    async function handlePayment(dietName: string, bank: string) {
        const { orderNo } = await (await fetch("/api/orderDeposit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                dietName,
                bank,
                returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
            })
        })).json();
        router.push(`/pay?order=${orderNo}`);
    }

    return (
        <div className="windowlike master-width">
            { manual ? <h3>手动定额充值</h3> : <h3>充值套餐</h3> }
            <div className="generic-vert-grid">
                <div className="bipartite">
                    {diets.map((diet) => (
                        <label className="radio-card" key={diet.name}>
                        <input
                            type="radio"
                            name="deposit-diet"
                            value={diet.name}
                            disabled={diet.availFrom !== null && new Date(diet.availFrom) > now || diet.availTill !== null && new Date(diet.availTill) < now}
                        />
                        <p>充 {formatMoneyFen(diet.cash, false)} 赠 {formatMoneyFen(diet.bonus, false)} </p>                        
                        <p>{ diet.availTill ? `有效期至 ${formatFLTToMinutes((new Date(diet.availTill)).getTime())}` : "常驻" }{diet.remaining !== null ? ` 剩 ${diet.remaining} 次` : ""}</p>
                        </label>
                    ))}
                </div>
                { manual ?
                    <div className="bipartite">
                        <label><span className="info-label">到账时间戳</span>（请补全分钟）：<br/>
                        <input type="text" inputMode="numeric" className="info-input" defaultValue={todayString} /></label>
                        <button className="Button" onClick={() => {
                            const selectedDiet = (document.querySelector('input[name="deposit-diet"]:checked') as HTMLInputElement)?.value;
                            const manualTimeStamp = (document.querySelector('input.info-input') as HTMLInputElement)?.value;
                            if (selectedDiet && manualTimeStamp) {
                                handleManualDepositSubmit({ userId, dietName: selectedDiet, manualTimeStamp });
                            }
                        }}>提交</button>
                    </div>
                :
                    <div className="bipartite">
                        <div className="Button primary" onClick={() => {
                            const selectedDiet = (document.querySelector('input[name="deposit-diet"]:checked') as HTMLInputElement)?.value;
                            if (selectedDiet) {
                                handlePayment(selectedDiet, "alipay");
                            }
                        }}>使用支付宝</div>
                        <div className="Button accept" onClick={() => {
                            const selectedDiet = (document.querySelector('input[name="deposit-diet"]:checked') as HTMLInputElement)?.value;
                            if (selectedDiet) {
                                handlePayment(selectedDiet, "wxpay");
                            }
                        }}>使用微信支付</div>
                    </div>
                }
                { manual ?
                    <>
                        {error && <p className="error">{error}</p>}
                        {message && <p className="success">{message}</p>}
                    </>
                : null
                }
            </div>
        </div>
    );
}
