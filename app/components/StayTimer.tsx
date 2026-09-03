"use client";

import {useState, useEffect} from "react";

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
    const secs = seconds % 60;
    const mins = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600);

    return (
        <span className="info-value">
            {hours}时 {mins.toString().padStart(2, '0')}分 {secs.toString().padStart(2, '0')}秒
        </span>
    );
}
