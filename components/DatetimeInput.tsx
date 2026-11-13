"use client";
import { toUnix, toFLT } from '@/lib/datetime';
import { useEffect, useState } from 'react';
import { isWorkday, isHoliday } from "chinese-days";

type DatetimeInputProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

type Parts = {
    year: number;
    month: string;
    day: string;
    hour: string;
    minute: string;
}

function splitDatetime(value: number): Parts {
    const flt = toFLT(value);
    return {
        year: flt.year,
        month: String(flt.month).padStart(2, '\u2007'),
        day: String(flt.day).padStart(2, '\u2007'),
        hour: String(flt.hour).padStart(2, '\u2007'),
        minute: String(flt.minute).padStart(2, '0')
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
            month: parseInt(next.month),
            day: parseInt(next.day),
            hour: parseInt(next.hour),
            minute: parseInt(next.minute),
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
                className="info-input"
                style={{ width: "3.4em" }}
            />
            <label> 年 </label>
            <input 
                type="text"
                inputMode="numeric" 
                value={parts.month} 
                onChange={e => update('month', parseInt(e.target.value))} 
                onKeyDown={e => {
                    if (e.key === 'ArrowUp') {
                        update('month', String(parseInt(parts.month) + 1).padStart(2, '\u2007'));
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        update('month', String(parseInt(parts.month) - 1).padStart(2, '\u2007'));
                        e.preventDefault();
                    }
                }}
                disabled={disabled} 
                className="info-input"
                style={{ width: "1.2em" }}
            />
            <label> 月 </label>
            <input 
                type="text" 
                inputMode="numeric" 
                value={parts.day} 
                onChange={e => update('day', parseInt(e.target.value))} 
                onKeyDown={e => {
                    if (e.key === 'ArrowUp') {
                        update('day', String(parseInt(parts.day) + 1).padStart(2, '0'));
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        update('day', String(parseInt(parts.day) - 1).padStart(2, '0'));
                        e.preventDefault();
                    }
                }}
                disabled={disabled} 
                className="info-input"
                style={{ width: "1.2em" }}
            />
            <label> 日<b style={{
                color: isHoliday(`${parts.year}-${parts.month}-${parts.day}`) ? 'var(--color-success)' : 'var(--cnt-blue2)' 
            }}>({weekdays[new Date(`${parts.year}-${parts.month}-${parts.day}`).getDay()]})</b> </label>
            
            <input 
                type="text"
                inputMode="numeric" 
                value={parts.hour} 
                onChange={e => update('hour', parseInt(e.target.value))} 
                onKeyDown={e => {
                    if (e.key === 'ArrowUp') {
                        update('hour', String(parseInt(parts.hour) + 1).padStart(2, '0'));
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        update('hour', String(parseInt(parts.hour) - 1).padStart(2, '0'));
                        e.preventDefault();
                    }
                }}
                disabled={disabled} 
                className="info-input"
                style={{ width: "1.2em" }}
            />
            <label> 点 </label>
            <input 
                type="text" 
                inputMode="numeric"
                value={parts.minute} 
                onChange={e => update('minute', parseInt(e.target.value))} 
                onKeyDown={e => {
                    if (e.key === 'ArrowUp') {
                        update('minute', String(parseInt(parts.minute) + 1).padStart(2, '0'));
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        update('minute', String(parseInt(parts.minute) - 1).padStart(2, '0'));
                        e.preventDefault();
                    }
                }}
                disabled={disabled} 
                className="info-input"
                style={{ width: "1.2em" }}
            />
            <label> 分 </label> 
            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <span style={{ color: '#999', fontFeatureSettings: 'unic' }}>Unix: {(value / 1000).toFixed(0)}</span>
            </div>
        </div>
    );
}
