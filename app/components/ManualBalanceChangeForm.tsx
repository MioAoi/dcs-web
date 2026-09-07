"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualBalanceChangeForm({
    userId,
}: {
    userId: number;
}) {
    const router = useRouter();
    const [balanceDelta, setBalanceDelta] = useState("");
    const [note, setNote] = useState(""); 

    async function handleCashChange(e: React.FormEvent) {
        e.preventDefault();
        const response = await fetch("/api/changebalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cashDelta: Math.round(Number(balanceDelta) * 100),
                bonusDelta: 0,
                note: note,
            }),
        });
        const result = await response.json();
        if (result.success) {
            router.refresh();
        }
    }

    async function handleBonusChange(e: React.FormEvent) {
        e.preventDefault();
        const response = await fetch("/api/changebalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cashDelta: 0,
                bonusDelta: Math.round(Number(balanceDelta) * 100),
                note: note,
            }),
        });
        const result = await response.json();
        if (result.success) {
            router.refresh();
        }
    }

    return (
        <div className="windowlike">
            <h3>余额变动</h3>
            <label className="info-label">变动金额：</label>
            <input
                type="string"
                value={balanceDelta}
                onChange={(e) => setBalanceDelta(e.target.value)}
                className="info-input amount-input"
            /><br />
            <label className="info-label">备注：</label><br/>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="info-input-small"
            ></textarea><br />
            <div className="bipartite">
            <button type="submit" onClick={handleBonusChange}>赠点变动</button>
            <button type="submit" className="danger" onClick={handleCashChange}>现金变动</button>
            </div>
        </div>
    );
}
