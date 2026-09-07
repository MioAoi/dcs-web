"use client";
import { useState } from "react";

export default function QqVerifyForm() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [pendingQqid, setPendingQqid] = useState("");
    const [token, setToken] = useState("");

    async function handleSubmit(e: React.FormEvent) { 
        e.preventDefault();
        const response = await fetch("/api/qqBindVerify", {
            method: "POST",
            body: JSON.stringify({ pendingQqid, token }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result = await response.json();
        if (result.success) {
            setMessage("验证成功");
            setError("");
        } else {
            setError(result.error || "验证失败");
            setMessage("");
        }
    }

    return (
        <div className="windowlike">
            <label className="info-label" htmlFor="pendingQqid">待绑QQ号：</label><br/>
            <input className="info-input short-input" onChange={(e) => setPendingQqid(e.target.value)} value={pendingQqid} /><br/>
            
            <label className="info-label" htmlFor="token">验证码：</label><br/>
            <textarea className="info-input-small" onChange={(e) => setToken(e.target.value)} value={token}></textarea><br/>
            
            <div className="Button primary" onClick={handleSubmit}>提交</div>
            <p className="error">{error}</p>
            <p className="success">{message}</p>
        </div>
    );
}