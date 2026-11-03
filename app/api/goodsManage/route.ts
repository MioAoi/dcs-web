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

export async function POST(request: Request) {
    const staff = await requireStaff();
    if (!staff) {
        return Response.json({ error: messages.e403_requireStaff }, { status: 403 });
    }
    const currentGoods: Goods[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), 'utf-8'));
    const { name, dispName, price } = await request.json();
    if (currentGoods.some(good => good.name === name)) {
        return Response.json({ error: messages.e400_goodsExists }, { status: 400 });
    }
    const newGoods = { name, dispName, price, avail: true };
    currentGoods.push(newGoods);
    fs.writeFileSync(path.join(process.cwd(), 'profiles', 'goods.json'), JSON.stringify(currentGoods), 'utf-8');
    return Response.json({ data: newGoods }, { status: 201 });
}
