"use client";
import { useState } from "react";
import SvgIcon from "./SvgIcon";

export default function BotSummaryCard({ nickname, botKey, permissions, actionList }: { nickname: string, botKey: string, permissions: string, actionList: string[] }) {
    const permissionList = permissions.split(",");
    const [currentPermissions, setCurrentPermissions] = useState(permissionList);
    const [saveButtonStatus, setSaveButtonStatus] = useState<"prepare" | "avail" | "saved">("prepare");
    function SaveButton() {
        if (saveButtonStatus === "prepare") {
            return (
                <button
                    disabled={true}
                    className="prepare"
                >
                    更新权限
                </button>
            )
        } else if (saveButtonStatus === "avail") {
            return (
                <button
                    onClick={handleUpdatePermissions}
                    className="action1"
                >
                    更新权限
                </button>
            )
        } else if (saveButtonStatus === "saved") {
            return (
                <button
                    disabled={true}
                    className="prepare"
                >
                    <SvgIcon name="checkmark" fill="var(--color-success-bright)"/>已保存权限
                </button>
            )
        }
    }
    async function handleNewKey() {
        const response = await fetch("/api/botData/newKey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldKey: botKey })
        });
        const result = await response.json();
        location.reload();
    }
    async function handleUpdatePermissions() {
        const response = await fetch("/api/botData/updatePermissions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ botKey, permissions: currentPermissions.join(",") })
        });
        const result = await response.json();
        if (result.success) {
            setSaveButtonStatus("saved");
        }
    }
    async function handleDelete() {
        const response = await fetch("/api/botData/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ botKey })
        });
        const result = await response.json();
    }
    return (
        <div className="windowlike master-width">
            <span className="nickname">{nickname}</span>
            <div>
                <span className="info-label">权限</span><br/>
                {actionList.map(action => (
                    <span key={action}>
                        <input type="checkbox" id={action} defaultChecked={currentPermissions.includes(action)} onChange={(e) => {
                            setSaveButtonStatus("avail");
                            if (e.target.checked) {
                                setCurrentPermissions([...currentPermissions, action]);
                            } else {
                                setCurrentPermissions(currentPermissions.filter(p => p !== action));
                            }
                        }}/>&thinsp;
                        <label htmlFor={action}>{action}</label><br/>
                    </span>
                ))}
            </div>
            <div>
                <span className="info-label">明钥</span><br/>
                <span className="info-value text-token key">{botKey}</span>
            </div>
            <div className="tripartite" style={{ gridTemplateColumns: "2fr 2fr 1fr"}}>
                <button onClick={handleNewKey}>重置明钥</button>
                <SaveButton />
                <button className="danger" onClick={handleDelete}>删除</button>
            </div>
            
        </div>
    )
}
