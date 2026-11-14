"use client";

import { useRouter } from "next/navigation";
import SvgIcon from "./SvgIcon";

export default function EnterButton({ state = "disabled" }: { state: "enter" | "disabled" | "refresh" }) {
    const router = useRouter();

    async function enter() {
        const response = await fetch("/api/enter", {
            method: "POST",
        });

        if (response.ok) {
            router.refresh();
        }
    }

    if (state == "disabled") {
        return (
            <button className="disabled" style={{ alignItems: "center" }}>
                <SvgIcon name="enter" size={1.6} />
                &thinsp;进店
            </button>
        )
    }

    if (state == "refresh") {
        return (
            <button className="action1" onClick={() => router.refresh()} style={{ alignItems: "center" }}>
                刷新状态
            </button>
        )
    }

    return (
        <button className="primary" onClick={enter} style={{ alignItems: "center" }}>
            <SvgIcon name="enter" size={1.6} />
            &thinsp;进店
        </button>
    );
}
