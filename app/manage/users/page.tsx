import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UserSummaryCard from "@/app/components/UserSummaryCard";

export default async function UsersLookupPage(
    { searchParams,} : { searchParams: Promise<{ q?: string }> }
 ) {
    const { q } = await searchParams;
    const users = q ?
        await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: q } },
                    { nickname: { contains: q } },
                    { qqid: { contains: q } },
                ],
            },
            take: 35,
            orderBy: {
                createdAt: "desc",
            },
        })
        : [];
    return (
        <main><h2>用户查询</h2>
            <form className="windowlike generic-vert-grid">
                <input name="q" defaultValue={q} placeholder="用户名 | 昵称 | QQ" />
                <button type="submit" className="fill-form">查询</button>
            </form>
            
            {users.map(user => (
                <UserSummaryCard key={user.id} user={user} />
            ))}
            <div className="master-width invwindow generic-vert-grid">
                <Link href="/manage" className="Button escape">▲返回管理</Link>
            </div>
        </main>
    );
}
