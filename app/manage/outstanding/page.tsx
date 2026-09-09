import OutstandingUserCard from "../../components/OutstandingUserCard";
import NavigateButton from "../../components/NavigateButton";
import { prisma } from "@/lib/prisma";

export default async function OutstandingUsersPage() {
    const outstandingUsers = await prisma.user.findMany({
        where: {
            balance: {
                lt: 0,
            },
        }, orderBy: {
            balance: "asc",
        }, include: {
            visits: true,
        }
    });
    const userDigests = outstandingUsers.map((user) => {
        const lastVisit = user.visits.sort((a, b) => (!(b.leftAt) ? 0 : b.leftAt.getTime()) - (!(a.leftAt) ? 0 : a.leftAt.getTime()))[0];
        return {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            balance: user.balance,
            enteredAt: lastVisit.enteredAt,
            leftAt: lastVisit.leftAt,
            charge: lastVisit.charge ?? 0,
        };
    });
    const indicateNemo = userDigests.length === 0 ? "当前没有欠费用户。" : "";
    return (
        <main>
            <h2>欠费用户</h2>
            {userDigests.map((userDigest) => (
                <OutstandingUserCard key={userDigest.id} userDigest={userDigest} />
            ))}
            {indicateNemo && <p className="info">{indicateNemo}</p>}
            <div className="master-width invwindow generic-vert-grid">
                <NavigateButton href="/manage" buttonText="▲返回管理" buttonColor="escape" />
            </div>
        </main>
    );
}
