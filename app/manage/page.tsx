import { prisma } from "@/lib/prisma";
import LogoutButton from "../components/LogoutButton";
import NavigateButton from "../components/NavigateButton";
import PresentUser from "../components/PresentUser";
import { loadCurrentPricing } from "@/lib/load";

export default async function PresentUsersPage() {
    const currentVisits = await prisma.visit.findMany({
        where: {
            leftAt: null,
        },
        include: {
            user: true,
        }
    })
    const currentPricing = await loadCurrentPricing();

    const indicateNemo = currentVisits.length === 0 ? "当前没有在店用户。" : "";

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
                {currentVisits.map((visit) => (
                    <PresentUser
                        key={visit.id}
                        visit={visit}
                        pricing={currentPricing}
                    />
                ))}
                {indicateNemo && <p className="info">{indicateNemo}</p>}
            </div>
        </main>
    );
}
