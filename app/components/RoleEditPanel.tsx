"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleEditPanel({ userId, userCurrentRole, chargeMultiplier: initialChargeMultiplier } : { userId: number, userCurrentRole: string, chargeMultiplier: number }) {
    const [chargeMultiplier, setChargeMultiplier] = useState(initialChargeMultiplier);
    const router = useRouter();

    async function handleRoleChange(newRole: string) {
        const response = await fetch("/api/generaluseredit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: newRole
            })
        })
        const result = await response.json();
        if (result.success) {
            router.refresh();
        }
    }

    async function handleChargeMultiplierChange(newChargeMultiplier: number) {
        const response = await fetch("/api/generaluseredit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                chargeMultiplier: newChargeMultiplier
            })
        });
        const result = await response.json();
        if (result.success) {
            setChargeMultiplier(newChargeMultiplier);
            router.refresh();
        }
    }

    return (
        <div className="windowlike master-width">
            <h3>权限编辑</h3>
                <div className="generic-vert-grid">
                <div className="change-field">
                    <span className="old-value">当前倍率：<span className="info-value">{initialChargeMultiplier}</span></span>
                    <span className="new-value"><label className="info-label">扣费倍率：</label>
                    <input 
                        className="info-input-small multiplier-input"
                        type="number" min="0" step="0.01"
                        value={chargeMultiplier}
                        onChange={(e) => setChargeMultiplier(parseFloat(e.target.value))}
                    /></span>
                    <button onClick={() => handleChargeMultiplierChange(chargeMultiplier)}>
                        更新倍率
                    </button>
                </div>
                <div className="bipartite">
                { userCurrentRole !== "STAFF" ? (
                    <div className="Button" onClick={() => handleRoleChange("STAFF")}>
                        设为士大夫
                    </div>
                ) : <div className="Button disabled">
                        设为士大夫
                    </div>
                }
                { userCurrentRole !== "CUSTOMER" ? (
                    <div className="Button" onClick={() => handleRoleChange("CUSTOMER")}>
                        设为普通用户
                    </div>
                ) : <div className="Button disabled">
                        设为普通用户
                    </div>
                }
                </div>
            </div>
        </div>
    );
}
