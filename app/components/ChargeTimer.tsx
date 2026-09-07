"use client";

import { useState, useEffect } from "react";
import { calculateCharge } from "@/lib/pricing";
import { formatMoneyFen } from "@/lib/money";

export default function ChargeTimer({ enterTime, chargeMultiplier }: { enterTime: number, chargeMultiplier: number}) {
    const [charge, setCharge] = useState(0);

    if (!enterTime) {
        return (
            <span className="info-value"/>
        );
    }

    useEffect(() => {
        function updateCharge() {
            const now = new Date();
            const charge = calculateCharge(new Date(enterTime), now).total * chargeMultiplier;
            setCharge(charge);
        }
        updateCharge();

        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000;

        let interval: ReturnType<typeof setInterval>;
        const timeout = setTimeout(() => {
            updateCharge();
            interval = setInterval(updateCharge, 60000);
        }, msUntilNextMinute);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [enterTime]);

    return (
        <span className="info-value">{formatMoneyFen(charge)}</span>
    );
}

