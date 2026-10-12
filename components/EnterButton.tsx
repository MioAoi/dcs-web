"use client";

import { useRouter } from "next/navigation";
import SvgIcon from "./SvgIcon";

export default function EnterButton({ disabled = false }: { disabled?: boolean }) {
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
        <button className={`primary ${disabled ? "disabled" : ""}`} onClick={disabled ? undefined : enter} style={{ alignItems: "center" }}>
            <SvgIcon name="enter" size={1.6} />
            &thinsp;进店
        </button>
    );
}
