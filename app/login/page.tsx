"use client";
import { messages } from "@/lib/messages";
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
            setError(messages.e401_loginCredentials);
        }
    }

    return (
        <main><h2>登录</h2>
            <form className="windowlike generic-vert-grid" onSubmit={handleSubmit}>
                <div><label className="info-label">用户名</label><br/>
                <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                /><br/></div>
                <div><label className="info-label">密码</label><br/>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /></div>

                <button type="submit" className="primary">登录</button>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="master-width invwindow">
                <Link href="/" className="Button escape">返回</Link>
            </div>
        </main>
    );
}