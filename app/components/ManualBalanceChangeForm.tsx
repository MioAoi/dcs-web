"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualBalanceChangeForm({
    userId,
    adminOperates,
}: {
    userId: number;
    adminOperates: boolean;
}) {
    const router = useRouter();
    const [balanceDelta, setBalanceDelta] = useState("");
    const [note, setNote] = useState(""); 

    const cashChangeButtons = adminOperates ? (
        <div className="bipartite">
            <button type="submit" onClick={() => handleCashChange(true)}>现金补正</button>
            <button type="submit" className="danger" onClick={() => handleCashChange(false)}>现金削平</button>
        </div>
    ) : null;

    async function handleCashChange(increase: boolean) {
        const response = await fetch("/api/changebalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cashDelta: increase ? Math.round(Math.abs(Number(balanceDelta) * 100)) : -Math.round(Math.abs(Number(balanceDelta) * 100)),
                bonusDelta: 0,
                note: note,
            }),
        });
        const result = await response.json();
        if (result.success) {
            router.refresh();
        }
    }

    async function handleBonusChange(increase: boolean) {
        const response = await fetch("/api/changebalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cashDelta: 0,
                bonusDelta: increase ? Math.round(Math.abs(Number(balanceDelta) * 100)) : -Math.round(Math.abs(Number(balanceDelta) * 100)),
                note: note,
            }),
        });
        const result = await response.json();
        if (result.success) {
            router.refresh();
        }
    }

    return (
        <div className="windowlike master-width">
            <h3>手动余额变动</h3><div className="generic-vert-grid">
                <div><label className="info-label">变动金额：</label>
                    <input
                        type="string"
                        value={balanceDelta}
                        onChange={(e) => setBalanceDelta(e.target.value)}
                        className="info-input amount-input"
                    />
                    <label className="info-label">&#x3000;备注：</label>
                </div>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="info-input-small"
                ></textarea>
                <div className="bipartite">
                    <button type="submit" className="accept" onClick={() => handleBonusChange(true)}>赠点赏予</button>
                    <button type="submit" className="decline" onClick={() => handleBonusChange(false)}>赠点扣除</button>
                </div>
                {cashChangeButtons}
            </div>
        </div>
    );
}
