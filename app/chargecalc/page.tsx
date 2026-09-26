"use server";
import ChargeCalc from "@/app/components/ChargeCalc"
import ManageNavigation from "@/app/components/ManageNavigation";
import { loadCurrentPricing } from "@/lib/load";

export default async function ChargeCalcPage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>价格计算器</h2>
            <ChargeCalc pricing={loadCurrentPricing()} />
        </main>
    )
}
