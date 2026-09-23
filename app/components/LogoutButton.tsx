"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const response = await fetch("/api/logout", {
          method: "POST",
        });
    
        if (response.ok) {
          router.push("/")
        }
    }

    return (
        <button onClick={handleLogout} className="escape">
            &#x23fb;&#xfe0e; 登出
        </button>
    )
}
