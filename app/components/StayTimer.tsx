"use client";

import { useState, useEffect } from "react";
import { formatTimeSeconds } from "@/lib/money";

export default function StayTimer(
    { enterTime, } : {enterTime: number} // as timestamp in milliseconds
) {
    if (!enterTime) {
        return (
            <span className="info-value">
                不在店
            </span>
        )
    }

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = Math.floor((now - enterTime) / 1000);
    const formattedTime = formatTimeSeconds(seconds);

    return (
        <span className="info-value">
            {formattedTime}
        </span>
    );
}
