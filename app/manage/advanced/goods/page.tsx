import { GoodsCreate, GoodsInfo } from '@/components/GoodsManage';
import ManageNavigation from "@/components/ManageNavigation";
import { loadAllGoods } from '@/lib/load'

export default function GoodsManagePage() {
    const currentGoods = loadAllGoods();
    return (
        <main>
            <ManageNavigation buttonLogout={false}/>
            <h2>商品管理</h2>
            <GoodsCreate />
            {currentGoods.map(goods => (
                <GoodsInfo key={goods.name} goods={goods} />
            ))} 
        </main>
    );
}
