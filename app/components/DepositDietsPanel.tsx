"use client";
import { formatMoneyFen } from "@/lib/money"
import { Key, useState } from "react";
import { toFLTStamp } from "@/lib/datetime"

export default function DepositDietsPanel({
    userId,
    diets,
}: {
    userId: number,
    diets: {
        name: string;
        availFrom: string | null;
        availTill: string | null;
        cash: number;
        bonus: number;
    }[]
}) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    // precompute date part as default for manual timestamp input
    const now = new Date();
    const todayString = toFLTStamp(now.getTime()).slice(0, 8);

    async function handleSubmit({ userId, dietName, manualTimeStamp } : { userId: number, dietName: string, manualTimeStamp: string }) {
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

    return (
        <div className="windowlike master-width"><h3>手动定额充值</h3>
            <div className="generic-vert-grid">
            <div className="bipartite">
                {diets.map((diet: { name: string; availFrom: string | null; availTill: string | null; cash: number; bonus: number; }) => (
                    <label className="radio-card" key={diet.name}>
                    <input
                        type="radio"
                        name="deposit-diet"
                        value={diet.name}
                        disabled={diet.availFrom !== null && new Date(diet.availFrom) > now || diet.availTill !== null && new Date(diet.availTill) < now}
                    />
                    充 {formatMoneyFen(diet.cash, false)} 赠 {formatMoneyFen(diet.bonus, false)}
                    </label>
                ))}
            </div>
            <div className="bipartite">
                <label><span className="info-label">到账时间戳</span>（请补全分钟）：<br/>
                <input type="text" inputMode="numeric" className="info-input" defaultValue={todayString} /></label>
                <button className="Button" onClick={() => {
                    const selectedDiet = (document.querySelector('input[name="deposit-diet"]:checked') as HTMLInputElement)?.value;
                    const manualTimeStamp = (document.querySelector('input.info-input') as HTMLInputElement)?.value;
                    if (selectedDiet && manualTimeStamp) {
                        handleSubmit({ userId, dietName: selectedDiet, manualTimeStamp });
                    }
                }}>提交</button>
            </div>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            </div>
        </div>

    );
}
