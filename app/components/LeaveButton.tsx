"use client";

import { useRouter } from "next/navigation";

export default function LeaveButton() {
    const router = useRouter();

    async function leave() {
        const response = await fetch("/api/leave", {
            method: "POST",
        });
        
        if (response.ok) {
            router.refresh();
        }
    }

    return (
        <button onClick={leave}>
            离店
        </button>
    );
}
