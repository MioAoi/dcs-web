import { prisma } from "@/lib/prisma";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";
import PresentUser from "../components/PresentUser";

export default async function PresentUsersPage() {
    const currentVisits = await prisma.visit.findMany({
        where: {
            leftAt: null,
        },
        include: {
            user: true,
        }
    })

    const indicateNemo = currentVisits.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <h2>在店用户</h2>
            <div className="master-width">
                {currentVisits.map((visit) => (
                    <PresentUser
                        key={visit.id}
                        visit={visit}
                    />
                ))}
                {indicateNemo && <p className="info">{indicateNemo}</p>}
            </div>
            <div className="master-width invwindow generic-vert-grid">
                <Link href="/manage/users" className="Button">用户管理</Link>
                <Link href="/manage/qqbindverify" className="Button">QQ绑定验证</Link>
                <Link href="/chargecalc" className="Button">价格计算器</Link>
                <LogoutButton/>
                <Link href="/dashboard" className="Button">▶玩家页</Link>
            </div>
        </main>
    );
}
