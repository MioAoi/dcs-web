"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleEditPanel({ userId, userCurrentRole } : { userId: number, userCurrentRole: string }) {
    const [chargeMultiplier, setChargeMultiplier] = useState(1);
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
        <div className="formlike master-width">
            <h3>权限编辑</h3>
            <label className="info-label">扣费倍率：</label>
            <input className="info-input multiplier-input" type="number" min="0" step="0.01" value={chargeMultiplier} onChange={(e) => setChargeMultiplier(parseFloat(e.target.value))}/>
            <button type="button" onClick={() => handleChargeMultiplierChange(chargeMultiplier)}>
                更新
            </button>
            <br/>
            { userCurrentRole !== "STAFF" ? (
                <button type="button" className="fill-half-form" onClick={() => handleRoleChange("STAFF")}>
                    设为士大夫
                </button>
            ) : <button type="button" className="fill-half-form disabled">
                    设为士大夫
                </button>
            }
            { userCurrentRole !== "CUSTOMER" ? (
                <button type="button" className="fill-half-form" onClick={() => handleRoleChange("CUSTOMER")}>
                    设为普通用户
                </button>
            ) : <button type="button" className="fill-half-form disabled">
                    设为普通用户
                </button>
            }
        </div>
    );
}
