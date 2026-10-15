'use client';
import { useState } from "react";

export function BookingCreatePanel({ consoles }: { consoles: { name: string, desc: string }[] }) {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [console, setConsole] = useState("");
    const [usernames, setUsernames] = useState("");

    async function handleSubmit() {
        const response = await fetch("/api/booking/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ startTime, endTime, console, usernames: usernames.split(',').map(u => u.trim()) }),
        });
        const result = await response.json();
        if (result) {
            location.reload();
        }
    }
    
    return (
        <div className="windowlike master-width">
            <h3>新建包机场</h3>
            <div style={{ display: "grid", columnGap: "1rem", gridTemplateColumns: "1fr 3fr", alignItems: "baseline" }}>
                <label className="info-label">开始时间</label><input className="info-input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div style={{ display: "grid", columnGap: "1rem", gridTemplateColumns: "1fr 3fr", alignItems: "baseline" }}>
                <label className="info-label">结束时间</label><input className="info-input" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div style={{ display: "grid", columnGap: "1rem", gridTemplateColumns: "1fr 3fr", alignItems: "baseline", marginTop: "0.5rem" }}>
                <label className="info-label">机台</label>
                <select className="info-input" value={console} onChange={(e) => setConsole(e.target.value)}>
                    <option value="">--请选择机台--</option>
                    <option value="all">包场</option>
                    {consoles.map((console) => (
                        <option key={console.name} value={console.name}>
                            {console.desc}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ display: "grid", columnGap: "1rem", gridTemplateColumns: "1fr 3fr", alignItems: "baseline" }}>
                <label className="info-label">用户名</label><input className="info-input" type="text" value={usernames} onChange={(e) => setUsernames(e.target.value)} />
            </div>
            <p>多个用户以逗号分隔</p>
            <button onClick={handleSubmit}>提交</button>
        </div>
    );
}

export function BookingSummaryCard({ booking }: { booking: { startTime: Date, endTime: Date, console: string, usernames: string } }) {
    return (
        <div className="windowlike master-width">
            <p>开始时间: {booking.startTime.toISOString()}</p>
            <p>结束时间: {booking.endTime.toISOString()}</p>
            <p>机台: {booking.console}</p>
            <p>用户名: {booking.usernames}</p>
        </div>
    );
}
