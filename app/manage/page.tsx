import LogoutButton from "../components/LogoutButton";
import NavigateButton from "../components/NavigateButton";
import PresentUser from "../components/PresentUser";
import { loadCurrentPricing } from "@/lib/load";
import { getInVenueList } from "@/lib/users";
import { connection } from "next/server";

export default async function PresentUsersPage() {
    await connection();
    const users = await getInVenueList();
    const currentPricing = await loadCurrentPricing();

    const indicateNemo = users.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <h2>管理面板</h2>
            <div className="master-width invwindow generic-vert-grid">
                <div className="bipartite">
                    <NavigateButton href="/manage/users" buttonText="通常用户管理" />
                    <NavigateButton href="/manage/qqbindverify" buttonText="QQ绑定验证" />
                    <NavigateButton href="/manage/outstanding" buttonText="欠费用户一览" />
                    <NavigateButton href="/chargecalc" buttonText="价格计算器" />
                </div>
                <div className="bipartite">
                    <LogoutButton/>
                    <NavigateButton href="/dashboard" buttonText="▶玩家页" />
                </div>
            </div>
            <h2>在店用户</h2>
            <div className="master-width">
                {users.map((user) => (
                    <PresentUser
                        key={user.id}
                        user={user}
                        pricing={currentPricing}
                    />
                ))}
                {indicateNemo && <p className="info">{indicateNemo}</p>}
            </div>
        </main>
    );
}
