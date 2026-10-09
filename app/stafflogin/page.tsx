"use client";

import Link from "next/dist/client/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/stafflogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const result = await response.json();

        if (result.success) {
            router.push("/manage");
        } else {
            setError("用户名或密码错误，或无权限");
        }
    }
    return ( <main><h1>管理登录</h1>
        <form className="windowlike generic-vert-grid" onSubmit={handleSubmit}>
            <div><label className="info-label">用户名</label><br/>
            <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="long-input info-input"
            /></div>
            <div><label className="info-label">密码</label><br/>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="long-input info-input"
            /></div>

            <button type="submit" className="primary">登录</button>
            {error && <p className="error">{error}</p>}
        </form>
        <div className="master-width invwindow">
            <Link href="/" className="Button escape">返回</Link>
        </div>
    </main> );
}