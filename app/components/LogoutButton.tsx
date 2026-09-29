"use client";

import { useRouter } from "next/navigation";
import SvgIcon from "@/app/components/SvgIcon";

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
        <button onClick={handleLogout} className="Button escape">
            <SvgIcon name="logout" />&thinsp;登出
        </button>
    )
}
