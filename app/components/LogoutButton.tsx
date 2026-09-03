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
        <div onClick={handleLogout} className="Button escape">
            登出
        </div>
    )
}
