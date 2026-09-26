import ManageNavigation from "@/app/components/ManageNavigation";
import UserSummaryCard from "@/app/components/UserSummaryCard";
import { userQuery } from "@/lib/users"
import { redirect } from "next/dist/client/components/navigation";

export default async function UsersLookupPage(
    { searchParams,} : { searchParams: Promise<{ q?: string, mode?: string }> }
 ) {
    const { q, mode } = await searchParams;

    const { users, exact } = q ? await userQuery(q, (mode === "auto")) : { users: [], exact: false };
    if (exact) {
        redirect(`/manage/users/${users[0].id}`);
    }

    const indicateNemo = users.length === 0 && q ? <p>未找到匹配的用户</p> : null;
    return (
        <main>
            <ManageNavigation buttonLogout={true} />
            <h2>用户查询</h2>
            <form className="windowlike master-width generic-vert-grid">
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
        </main>
    );
}
