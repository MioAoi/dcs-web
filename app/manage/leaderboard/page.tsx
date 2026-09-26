import { getTopRecentSpenders } from "@/lib/users";
import ManageNavigation from "@/app/components/ManageNavigation";
import { prisma } from "@/lib/prisma";
import UserOneline from "@/app/components/UserOneline";
import { formatMoneyFen } from "@/lib/money";
export default async function LeaderboardPage() {
    const topSpenders = await Promise.all(
        (await getTopRecentSpenders()).map(async (spender) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: spender.userId
                }
            });
            if (!user) {
                return null;
            }
            return {
                ...user,
                spent: spender._sum.charge ?? 0
            }
        })
    );
    return (
        <main>
            <ManageNavigation buttonLogout={false}/>
            <h2>消费榜</h2>
            <div className="master-width windowlike generic-vert-grid">
                {topSpenders.filter(spender => spender !== null).map((spender, index) => (
                    <div key={index} className="leftwide">
                        <span>
                            <UserOneline user={spender} />
                        </span>
                        <span className={`info-value ${index == 0 ? "gold" : index == 1 ? "silver" : index == 2 ? "bronze" : ""}`}>{"\u00a0"+formatMoneyFen(spender.spent)}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}
