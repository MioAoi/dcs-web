"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";

export default function Register() {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState(""); 
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== password2) {
            setError("两次输入的密码不一致");
            return;
        }

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                nickname,
            }),
        });

        const result = await response.json();

        if (result.success) {
            setMessage("注册成功，3秒后返回首页");
            setError("");
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } else {
            if (result.error === "USERNAME_INVALID") {
                setError("用户名格式不正确");
            } else if (result.error === "PASSWORD_INVALID") {
                setError("密码格式不正确");
            } else if (result.error === "USERNAME_EXISTS") {
                setError("用户名已存在");
            }
        }
    }

    return (
        <main>
            <h1>注册</h1>

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
                    <label>显示名</label><br/>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
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
                <div>
                    <label>再次输入密码</label><br/>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <div onClick={handleSubmit} className="Button primary">注册</div>
                <p className="error">{error}</p>
                <p className="success">{message}</p>
            </form>
            
            <div className="master-width">
                <Link href="/" className="Button escape">返回</Link>
            </div>
        </main>
    );
}
