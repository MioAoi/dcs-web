import OutstandingUserCard from "../../components/OutstandingUserCard";
import { prisma } from "@/lib/prisma";
import ManageNavigation from "@/app/components/ManageNavigation";

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
            ...user,
            enteredAt: lastVisit.enteredAt,
            leftAt: lastVisit.leftAt,
            charge: lastVisit.charge ?? 0,
        };
    });
    const indicateNemo = userDigests.length === 0 ? "当前没有欠费用户。" : "";
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>欠费用户</h2>
            {userDigests.map((userDigest) => (
                <OutstandingUserCard key={userDigest.id} user={userDigest} />
            ))}
            {indicateNemo && <p className="info">{indicateNemo}</p>}
        </main>
    );
}
