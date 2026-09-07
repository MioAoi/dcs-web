"use client";

import { useRouter } from "next/navigation";

export default function EnterButton() {
    const router = useRouter();

    async function enter() {
        const response = await fetch("/api/enter", {
            method: "POST",
        });

        if (response.ok) {
            router.refresh();
        }
    }

    return (
        <button className="primary" onClick={enter}>
            进店
        </button>
    );
}
