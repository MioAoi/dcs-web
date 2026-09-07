"use client";

import { calculateCharge } from "@/lib/pricing"
import { useState } from "react"
import { formatMoneyFen } from "@/lib/money"
import Link from "next/dist/client/link";

export default function ChargeCalc() {
    const [enterTime, setEnterTime] = useState("");
    const [leaveTime, setLeaveTime] = useState("");

    let price = null;
    if (enterTime && leaveTime) {
        price = calculateCharge(new Date(enterTime), new Date(leaveTime));
    }

    return (
        <main><h2>价格计算器</h2>
            <div className="windowlike generic-vert-grid"><h3>输入时间</h3>
                <div><label><span className="info-label">进店</span><br/>
                    <input type="datetime-local" className="info-input" value={enterTime} onChange={(e) => setEnterTime(e.target.value)}/>
                </label></div>
                <div><label><span className="info-label">离店</span><br/>
                    <input type="datetime-local" className="info-input" value={leaveTime} onChange={(e) => setLeaveTime(e.target.value)}/>
                </label></div>
            </div>
            <div className="master-width windowlike"><h3>结果</h3>
                价格: <br/>
                <span className="info-value">{price ? formatMoneyFen(price.total) : "未计算"}</span><br/>
                价格明细: <br/>
                <span style={{ whiteSpace: "pre-wrap" }}>{price ? price.priceDetail : "未计算"}</span>
            </div>
            <div className="master-width invwindow generic-vert-grid">
                <Link className="Button escape" href="/manage">▲管理面板</Link>
            </div>
        </main>
    )
}
