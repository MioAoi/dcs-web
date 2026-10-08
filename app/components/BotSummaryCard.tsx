"use client";
import { useState } from "react";

export default function BotSummaryCard({ nickname, botKey, permissions, actionList }: { nickname: string, botKey: string, permissions: string, actionList: string[] }) {
    const permissionList = permissions.split(",");
    const [currentPermissions, setCurrentPermissions] = useState(permissionList);
    const [message, setMessage] = useState("");
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
            setMessage("操作成功，3秒后刷新");
        }
        setTimeout(() => location.reload(), 3000);
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
        if (result.success) {
            setMessage("操作成功，3秒后刷新");
        }
        setTimeout(() => location.reload(), 3000);
    }
    return (
        <div className="windowlike master-width">
            <div className="bipartite">
                <span className="nickname">{nickname}</span>
                <span className="success">{message}</span>
            </div>
            <div>
                <span className="info-label">权限</span><br/>
                {actionList.map(action => (
                    <span key={action}>
                        <input type="checkbox" id={action} defaultChecked={currentPermissions.includes(action)} onChange={(e) => {
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
            <div className="tripartite">
                <button onClick={handleNewKey}>重置明钥</button>
                <button onClick={() => handleUpdatePermissions()}>更新权限</button>
                <button className="danger" onClick={handleDelete}>删除</button>
            </div>
            
        </div>
    )
}
