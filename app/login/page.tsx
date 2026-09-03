"use client";

import Link from "next/dist/client/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/login", {
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
            router.push("/dashboard");
        } else {
            setError("用户名或密码错误");
        }
    }

    return (
        <main>
            <h2>登录</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <label>用户名</label><br/>
                <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                <label>密码</label><br/>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <div onClick={handleSubmit} className="Button primary">登录</div>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="master-width">
                <Link href="/" className="Button escape">返回</Link>
            </div>
        </main>
    );
}