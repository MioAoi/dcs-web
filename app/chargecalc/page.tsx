"use client";

import { calculateCharge } from "@/lib/pricing"
import { useState } from "react"
import { formatMoneyFen } from "@/lib/pricing"
import ToManageDashButton from "@/app/components/ToManageDashButton";

export default function ChargeCalc() {
    const [enterTime, setEnterTime] = useState("");
    const [leaveTime, setLeaveTime] = useState("");

    let price = null;
    if (enterTime && leaveTime) {
        price = calculateCharge(new Date(enterTime), new Date(leaveTime));
    }

    return (
        <main>
            <h2>价格计算器</h2>
            <div className="master-width windowlike">
                <label><span className="info-label">进店时间</span><br/>
                <input type="datetime-local" className="info-input" value={enterTime} onChange={(e) => setEnterTime(e.target.value)}/>
                </label>
            </div>
            <div className="master-width windowlike">
                <label><span className="info-label">离店时间</span><br/>
                <input type="datetime-local" className="info-input" value={leaveTime} onChange={(e) => setLeaveTime(e.target.value)}/>
                </label>
            </div>

            <div className="master-width windowlike">
                <span className="info-label">价格: </span><br/><span className="info-value">{price ? formatMoneyFen(price.total) : "未计算"}</span>
                <br/>
                价格明细: <br/><span style={{ whiteSpace: "pre-wrap" }}>{price ? price.priceDetail : "未计算"}</span>
            </div>
            <div className="master-width">
                <ToManageDashButton />
            </div>
        </main>
    )
}
