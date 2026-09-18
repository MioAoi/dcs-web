import { requireUserOrRedirect } from "@/lib/auth";
import fs from "fs";
import DepositDietsPanel from "../components/DepositDietsPanel";
import { getUserAvailDepositDiets } from "@/lib/users";

export default async function DepositPage() {
    const user = await requireUserOrRedirect();

    return (
        <main>
            <h1>充值页面</h1>
            <DepositDietsPanel userId={user.id} diets={await getUserAvailDepositDiets(user.id)} manual={false} />

        </main>
    );
}
