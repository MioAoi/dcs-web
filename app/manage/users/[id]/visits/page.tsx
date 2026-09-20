import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserOneline from "@/app/components/UserOneline";
import { getUserLatestVisits } from "@/lib/users";
import { formatRelativeFLTToMinutes, formatFLTToMinutes } from "@/lib/datetime";
import { formatMoneyFen } from "@/lib/money";

export default async function UserVisitsPage({
    params,
} : {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) }
    });
    if (!user) {
        notFound();
    }
    const visits = await getUserLatestVisits(Number(id));

    return (
        <main>
            <h2>来店记录 <UserOneline user={user} /></h2>
            <div className="windowlike master-width generic-vert-grid">
                <p>只显示最近 15 条</p>
                <div className="visitListing table-header">
                    <p>进店时间</p>
                    <p>离店时间</p>
                    <p>扣费</p>
                </div>
                {visits.map((visit) => (
                    <div key={visit.id} className="visitListing">
                        <p>{formatFLTToMinutes(visit.enteredAt.getTime())}</p>
                        <p>{visit.leftAt ? formatRelativeFLTToMinutes(visit.leftAt.getTime(), visit.enteredAt.getTime()) : "-"}</p>
                        <p>{visit.charge != null ? formatMoneyFen(visit.charge) : "-"}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
