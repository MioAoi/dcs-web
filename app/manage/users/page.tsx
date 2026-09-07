import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UserSummaryCard from "@/app/components/UserSummaryCard";
import { redirect } from "next/dist/client/components/navigation";

export default async function UsersLookupPage(
    { searchParams,} : { searchParams: Promise<{ q?: string, mode?: string }> }
 ) {
    const { q, mode } = await searchParams;

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

    if (mode === "auto") {
        const exact = users.find(
            user => user.username === q || user.qqid === q
        )
        if (exact) {
            redirect(`/manage/users/${exact.id}`);
        }
        if (users.length === 1) {
            redirect(`/manage/users/${users[0].id}`);
        }
    }
    const indicateNemo = users.length === 0 && q ? <p>未找到匹配的用户</p> : null;
    return (
        <main><h2>用户查询</h2>
            <form className="windowlike generic-vert-grid">
                <input name="q" defaultValue={q} placeholder="用户名 | 昵称 | QQ" />
                <div className="bipartite">
                    <button type="submit" name="mode" value="auto" className="primary">精确查询</button>
                    <button type="submit" name="mode" value="list">一般查询</button>
                </div>
            </form>
            {indicateNemo}
            {users.map(user => (
                <UserSummaryCard key={user.id} user={user} />
            ))}
            <div className="master-width invwindow generic-vert-grid">
                <Link href="/manage" className="Button escape">▲返回管理</Link>
            </div>
        </main>
    );
}
