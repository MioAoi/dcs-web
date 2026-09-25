"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetAvatarPanel({ userId, avatars } : { userId: number, avatars: { filename: string, ext: string, desc: string }[] }) {
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
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
            setError("设置失败");
        } else {
            setError(null);
            setMessage("3秒后返回");
            setTimeout(() => {
                router.push("/selfinfo");
            }, 3000);
        }
    }
        

    return (
        <div className="avatarPanel windowlike">
            <div className="avatar-selection">
                <div onClick={() => { setAvatar(null); setSelectedAvatar(null); }}>
                    <img src={`/avatars/default.webp`} alt="不设置" />
                    {error && selectedAvatar === null ? <p className="error label">{error}</p> : message && selectedAvatar === null ? <p className="success label">{message}</p> : <p className="label">沿用QQ头像</p>}
                </div>
                {avatars.map((avatar) => (
                    <div key={avatar.filename} onClick={() => { setAvatar(avatar.filename); setSelectedAvatar(avatar.filename); }}>
                        <img src={`/avatars/${avatar.filename}`} alt={avatar.desc} />
                        {error && selectedAvatar === avatar.filename ? <p className="error label">{error}</p> : message && selectedAvatar === avatar.filename ? <p className="success label">{message}</p> : <p className="label">{avatar.desc}</p>}
                    </div>
                ))}
                
            </div>
        </div>
        
    );
}
