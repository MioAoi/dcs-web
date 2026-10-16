'use client';
import { useState } from "react";
import UserOneline from "@/components/UserOneline";
import type { User } from "@/generated/prisma/client";
import SvgIcon from "@/components/SvgIcon";
import { formatFLTToMinutes, formatRelativeFLTToMinutes } from "@/lib/datetime";

type Booking = {
    id: number;
    startTime: Date;
    endTime: Date;
    console: string;
    users: {
        user: {
            id: number;
            username: string;
        }
    }[];
}

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
            <h3>新建包机场事件</h3>
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
                <label className="info-label">用户名</label><input className="info-input username" type="text" value={usernames} onChange={(e) => setUsernames(e.target.value)} />
            </div>
            <p>多个用户以逗号分隔</p>
            <button onClick={handleSubmit}>提交</button>
        </div>
    );
}

export function BookingSummaryCard({ booking, users, consoleDesc }: { booking: Booking, users: { user: User }[], consoleDesc: string }) {
    return (
        <div className="windowlike master-width">
            <h5>{consoleDesc} {users.length}人</h5>
            <div style={{ display: "grid", rowGap: "0rem", margin: "0" }}>
                {users.map((u) => {
                    return (
                        <UserOneline key={u.user.id} user={u.user} clickable={true}/>
                    );
                })}
            </div>
            <div className="leftwide" style={{ marginTop: "0.5rem" }}>
                <span className="info-value"><SvgIcon name="enter" correctAlign={true}/> {formatFLTToMinutes(booking.startTime.getTime(), false)}</span>
                <span className="info-value"><SvgIcon name="exit" correctAlign={true}/> {formatRelativeFLTToMinutes(booking.endTime.getTime(), booking.startTime.getTime())}</span>
            </div>
        </div>
    );
}
