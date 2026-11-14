"use server";
import ChargeCalc from "@/components/ChargeCalc"
import ManageNavigation from "@/components/ManageNavigation";
import { loadCurrentPricingv2 } from "@/lib/load";

export default async function ChargeCalcPage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>价格计算器</h2>
            <ChargeCalc />
        </main>
    )
}
