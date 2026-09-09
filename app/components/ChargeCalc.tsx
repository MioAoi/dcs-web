"use client";
import { useState } from "react";
import NavigateButton from "./NavigateButton";
import { formatMoneyFen } from "@/lib/money";
import { calculateCharge } from "@/lib/pricing";

type RateSegment = {
    startMinute: number;
    endMinute: number;
    rate: number;
    maxout?: number;
    globalDiscountApply?: boolean;
};

export default function ChargeCalc({ pricing }: { pricing: { circadyRates: RateSegment[]; globalDiscount: number } }) {
    const [enterTime, setEnterTime] = useState("");
    const [leaveTime, setLeaveTime] = useState("");

    let price = null;
    if (enterTime && leaveTime) {
        price = calculateCharge(new Date(enterTime), new Date(leaveTime), pricing);
    }
    
    return (<>
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
                <NavigateButton href="/manage" buttonText="▲管理面板" buttonColor="escape" />
            </div>
            </>
    )
}
