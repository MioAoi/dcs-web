'use client';
import { useState } from 'react';
import { formatMoneyFen } from '@/lib/money'

type Goods = {
    name: string;
    dispName: string;
    price: number;
    avail: boolean;
}

export function GoodsCreate() {
    const [name, setName] = useState('');
    const [dispName, setDispName] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');
    async function createGoods() {
        await console.log("Creating goods with", { name, dispName, price });
        const response = await fetch('/api/goodsManage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, dispName, price: Math.round(price * 100) })
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || '创建失败');
        } else {
            location.reload();
        }
    }
    return (
        <div className="master-width windowlike leftverywide">
            <div className="generic-vert-grid">
                <div className="rightwide">
                    <label className="info-label">主键</label>
                    <input className="info-input-small" style={{ width: '9rem', fontFamily: 'var(--font-code)' }} type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="rightwide">
                    <label className="info-label">名称</label>
                    <input className="info-input-small" style={{ width: '9rem' }} type="text" value={dispName} onChange={e => setDispName(e.target.value)} />
                </div>
                <div className="rightwide">
                    <label className="info-label">价格</label>
                    <input className="info-input" style={{ width: '5rem' }} type="number" value={price} step="0.01" min="0" onChange={e => setPrice(Number(e.target.value))} />
                </div>
            </div>
            <div>
                <button onClick={createGoods}>
                    创建
                </button>
                <div>
                    {error ? <span className="error">{error}</span> : "\u3000"}
                </div>
            </div>
        </div>
    )
}

export function GoodsInfo({ goods }: { goods: Goods }) {
    const [dispName, setDispName] = useState(goods.dispName || "");
    const [price, setPrice] = useState((goods.price || 0) / 100);
    const [avail, setAvail] = useState(goods.avail || false);
    const [error, setError] = useState('');
    async function updateGoods() {
        const res = await fetch(`/api/goodsManage/${goods.name}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dispName, price: Math.round(price * 100), avail })
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || '更新失败');
        } else {
            setError('');
            location.reload();
        }
    }
    async function deleteGoods() {
        const res = await fetch(`/api/goodsManage/${goods.name}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || '删除失败');
        } else {
            setError('');
            location.reload();
        }
    }
    return (
        <div className="master-width windowlike card-goods">
            <img className="avatar" src={`/goodspics/${goods.name.replace(".", "_")}.webp`} alt={goods.dispName} />
            <div className="generic-vert-grid">
                <span style={{ fontFamily: "var(--font-code)", color: "var(--color-status)" }}>{goods.name}</span>
                <div>
                    <label className="info-label">名称</label>&nbsp;
                    <input className="info-input-small" style={{ width: '9rem' }} type="text" value={dispName} onChange={e => setDispName(e.target.value)} />
                </div>
                <div>
                    <label className="info-label">价格</label>&nbsp;
                    <input className="info-input" style={{ width: '5rem' }} type="number" step="0.01" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} />&nbsp;
                    <input
                        type="checkbox"
                        checked={avail}
                        onChange={e => setAvail(e.target.checked)}
                    /> 上架
                </div>
            </div>
            <div className="generic-vert-grid">
                <button onClick={updateGoods}>
                    更新
                </button>
                <button className="danger" onClick={deleteGoods}>
                    删除
                </button>
                <div>
                    {error ? <span className="error">{error}</span> : null}
                </div>
            </div>
        </div>
        
    );
}
