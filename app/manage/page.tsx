import {prisma} from "@/lib/prisma";
import LogoutButton from "../components/LogoutButton";
import { requireStaffOrRedirect } from "@/lib/auth";
import Link from "next/link";
import PresentUser from "../components/PresentUser";

export default async function Manage() {
    const currentVisits = await prisma.visit.findMany({
        where: {
            leftAt: null,
        },
        include: {
            user: true,
        }
    })

    var presentUsersSummary = "";
    currentVisits.forEach(visit => {
        presentUsersSummary += "<b>" + visit.user.nickname + "</b>, " + visit.enteredAt + "进店" + "<br/>";
    });
    if (presentUsersSummary.endsWith("<br/>")) {
        presentUsersSummary = presentUsersSummary.slice(0, -5);
    }
    if (presentUsersSummary === "") {
        presentUsersSummary = "当前没有在店用户。";
    }

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
            </div>
            <div className="master-width">
                <Link href="/manage/users" className="Button">用户管理</Link>
                <Link href="/chargecalc" className="Button">价格计算器</Link>
                <LogoutButton/>
                <Link href="/dashboard" className="Button">▶玩家页</Link>
            </div>
        </main>
    );
}
