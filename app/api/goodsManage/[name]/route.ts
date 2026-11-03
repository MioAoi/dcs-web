import fs from 'fs';
import path from 'path';
import { requireStaff } from '@/lib/auth';
import { messages } from '@/lib/messages';

type Goods = {
    name: string;
    dispName: string;
    price: number;
    avail: boolean;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ name: string }> }) {
    const staff = await requireStaff();
    if (!staff) {
        return Response.json({ error: messages.e403_requireStaff }, { status: 403 });
    }
    const currentGoods: Goods[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), 'utf-8'));
    const { dispName, price, avail } = await request.json();
    const { name } = await params;
    const goodsIndex = currentGoods.findIndex(good => good.name === name);
    if (goodsIndex === -1) {
        return Response.json({ error: messages.e404_goods }, { status: 404 });
    }
    currentGoods[goodsIndex] = { name, dispName, price, avail };
    fs.writeFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), JSON.stringify(currentGoods), 'utf-8');
    return Response.json({ data: currentGoods[goodsIndex] }, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ name: string }> }) {
    const staff = await requireStaff();
    if (!staff) {
        return Response.json({ error: messages.e403_requireStaff }, { status: 403 });
    }
    const currentGoods: Goods[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), 'utf-8'));
    const { name } = await params;
    const goodsIndex = currentGoods.findIndex(good => good.name === name);
    if (goodsIndex === -1) {
        return Response.json({ error: messages.e404_goods }, { status: 404 });
    }
    currentGoods.splice(goodsIndex, 1);
    fs.writeFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), JSON.stringify(currentGoods), 'utf-8');
    return Response.json({ data: true }, { status: 200 });
}
