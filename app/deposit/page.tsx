import { requireUserOrRedirect } from "@/lib/auth";
import fs from "fs";
import DepositDietsPanel from "../components/DepositDietsPanel";
import { getUserAvailDepositDiets } from "@/lib/users";
import PlayerNavigation from "../components/PlayerNavigation";

export default async function DepositPage() {
    const user = await requireUserOrRedirect();
    const webDepositUsable = (fs.readFileSync("站内充值可用否.txt", "utf8").charAt(0) === "y");
    if (!webDepositUsable) {
        return (
            <main>
                <PlayerNavigation buttonManage={user.role == "STAFF" || user.role == "ADMIN"} buttonLogout={true} />
                <h1>充值页面</h1>
                <p>站内充值当前不可用。</p>
            </main>
        );
    }

    return (
        <main>
            <PlayerNavigation buttonManage={user.role == "STAFF" || user.role == "ADMIN"} buttonLogout={true} />
            <h1>充值页面</h1>
            <DepositDietsPanel userId={user.id} diets={await getUserAvailDepositDiets(user.id)} manual={false} />

        </main>
    );
}
