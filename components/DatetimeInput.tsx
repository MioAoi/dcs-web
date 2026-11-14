"use client";
import { toUnix, toFLT } from '@/lib/datetime';
import { useEffect, useState } from 'react';
import { isHoliday } from "chinese-days";

type DatetimeInputProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

type Parts = {
    year: number;
    month: number;
    dayTens: number;
    dayOnes: number;
    hourTens: number;
    hourOnes: number;
    minuteTens: number;
    minuteOnes: number;
}

function splitDatetime(value: number): Parts {
    const flt = toFLT(value);
    return {
        year: flt.year,
        month: flt.month,
        dayTens: Math.floor(flt.day / 10),
        dayOnes: flt.day % 10,
        hourTens: Math.floor(flt.hour / 10),
        hourOnes: flt.hour % 10,
        minuteTens: Math.floor(flt.minute / 10),
        minuteOnes: flt.minute % 10
    };
}

export default function DatetimeInput({ 
    value, 
    onChange, 
    disabled 
}: DatetimeInputProps) {
    const [parts, setParts] = useState<Parts>(() => splitDatetime(value));
    useEffect(() => {
        setParts(splitDatetime(value));
    }, [value]);

    function update(key: keyof Parts, value: string | number) {
        const next = { ...parts, [key]: value };
        setParts(next);
        onChange(toUnix({
            year: next.year,
            month: next.month,
            day: next.dayTens * 10 + next.dayOnes,
            hour: next.hourTens * 10 + next.hourOnes,
            minute: next.minuteTens * 10 + next.minuteOnes,
            second: 0,
            ms: 0
        }));
    }
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return (
        <div>
            <input 
                type="number" 
                value={parts.year} 
                onChange={e => update('year', parseInt(e.target.value))} 
                disabled={disabled}
                style={{ width: "3.5em" }}
            />
            <label> 年 </label>
            <select value={parts.month} onChange={e => {
                update('month', parseInt(e.target.value));
            }}>
                {Array.from({ length: 14 }, (_, i) => (
                    <option key={i} value={i}>
                        {i == 0 ? '\u2212' : i == 13 ? '+' : String(i).padStart(2, '\u2007') + '月'}
                    </option>
                ))}
            </select>
            <select value={parts.dayTens} onChange={e => {
                update('dayTens', parseInt(e.target.value));
            }}>
                {Array.from({ length: 6 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 3 ? '+' : i - 1}
                    </option>
                ))}
            </select>
            <select value={parts.dayOnes} onChange={e => {
                update('dayOnes', parseInt(e.target.value));
            }}>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 9 ? '+' : String(i - 1) + '日'}
                    </option>
                ))}
            </select>
            <b style={{
                color: isHoliday(value) ? 'var(--color-success)' : 'var(--cnt-blue2)' 
            }}>({weekdays[new Date(value - 14400000).getDay()]})</b>
            
            <select value={parts.hourTens} onChange={e => {
                update('hourTens', parseInt(e.target.value));
            }}>
                {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 2 ? '+' : i - 1}
                    </option>
                ))}
            </select>
            <select value={parts.hourOnes} onChange={e => {
                update('hourOnes', parseInt(e.target.value));
            }}>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 9 ? '+' : String(i - 1) + '点'}
                    </option>
                ))}
            </select>
            <select value={parts.minuteTens} onChange={e => {
                update('minuteTens', parseInt(e.target.value));
            }}>
                {Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 5 ? '+' : i - 1}
                    </option>
                ))}
            </select>
            <select value={parts.minuteOnes} onChange={e => {
                update('minuteOnes', parseInt(e.target.value));
            }}>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i - 1}>
                        {i - 1 < 0 ? '\u2212' : i - 1 > 9 ? '+' : String(i - 1) + '分'}
                    </option>
                ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <span style={{ color: '#999', fontFeatureSettings: 'unic' }}>Unix: {(value / 1000).toFixed(0)}</span>
            </div>
        </div>
    );
}
