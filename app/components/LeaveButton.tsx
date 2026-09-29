"use client";

import { useRouter } from "next/navigation";
import SvgIcon from "./SvgIcon";
export default function LeaveButton({ disabled = false }: { disabled?: boolean }) {
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
        <button onClick={disabled ? undefined : leave} style={{ alignItems: "center" }} className={disabled ? "disabled" : ""}>
            <SvgIcon name="exit" size={1.6} />
            &thinsp;离店
        </button>
    );
}
