"use client";

import { useState, useEffect } from "react";
import { calculateCharge } from "@/lib/pricingv2";
import { formatMoneyFen } from "@/lib/money";
import { loadCurrentPricingv2 } from "@/lib/load";

export default async function ChargeTimer({ enterTime, chargeMultiplier }: { enterTime: number, chargeMultiplier: number }) {
    const [charge, setCharge] = useState(0);
    const rater = await loadCurrentPricingv2().then(pricing => pricing.rater);

    if (!enterTime) {
        return (
            <span className="info-value"/>
        );
    }

    useEffect(() => {
        function updateCharge() {
            const now = new Date();
            const charge = calculateCharge(new Date(enterTime), now, rater).total * chargeMultiplier;
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
