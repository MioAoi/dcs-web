"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetAvatarPanel({ userId, avatars } : { userId: number, avatars: { filename: string, ext: string, desc: string }[] }) {
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    async function setAvatar(filename: string | null) {
        const res = await fetch("/api/generaluseredit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, avatar: filename })
        });
        if (!res.ok) {
            setMessage(null);
            setError("设置头像失败");
        } else {
            setError(null);
            setMessage("设置头像成功，3秒后返回");
            setTimeout(() => {
                router.push("/selfinfo");
            }, 3000);
        }
    }
        

    return (
        <div className="master-width windowlike">
            <div className="avatar-selection">
                <div onClick={() => setAvatar(null)}>
                    <img src={`/avatars/default.webp`} alt="不设置" />
                    <i>沿用QQ头像</i>
                </div>
                {avatars.map((avatar) => (
                    <div key={avatar.filename} onClick={() => setAvatar(avatar.filename)}>
                        <img src={`/avatars/${avatar.filename}`} alt={avatar.desc} />
                        <p>{avatar.desc}</p>
                    </div>
                ))}
                
            </div>
            {error ? <p className="error">{error}</p> : message ? <p className="success">{message}</p> : "\u3000"}
        </div>
        
    );
}
