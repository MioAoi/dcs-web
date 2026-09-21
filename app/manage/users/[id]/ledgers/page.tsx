import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserOneline from "@/app/components/UserOneline";
import { getUserLatestLedgers } from "@/lib/users";
import { formatFLTToMinutes } from "@/lib/datetime";
import { formatMoneyFen, translateLedgerType } from "@/lib/money";
import NavigateButton from "@/app/components/NavigateButton";

export default async function UserLedgersPage({
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
    const ledgers = await getUserLatestLedgers(Number(id));
    return (
        <main>
            <h2>余额变动 <UserOneline user={user} /></h2>
            <div className="invwindow master-width">
                <NavigateButton href={`/manage/users/${id}`} buttonText="▲返回用户" buttonColor="escape"/>
            </div>
            <div className="windowlike master-width generic-vert-grid">
                <p>只显示最近 15 条</p>
                <div className="ledgerListing table-header">
                    <p>时间</p>
                    <p>类型</p>
                    <p>现金变动</p>
                    <p>赠点变动</p>
                </div>
                {ledgers.map((ledger) => (
                    <div key={ledger.id} className="ledgerListing">
                        <p>{formatFLTToMinutes(ledger.createdAt.getTime())}</p>
                        <p>{translateLedgerType(ledger.type)}</p>
                        <p>{ledger.cashChange != null ? 
                            (ledger.cashChange > 0 ?
                                (<span className="money-gain">{"+" + formatMoneyFen(ledger.cashChange)}</span>) :
                            (ledger.cashChange < 0 ?
                                (<span>{"\u2212" + formatMoneyFen(Math.abs(ledger.cashChange))}</span>) :
                            (<span>-</span>)
                            )
                            ) : "-"}</p>
                        <p>{ledger.bonusChange != null ? 
                            (ledger.bonusChange > 0 ?
                                (<span className="money-gain">{"+" + formatMoneyFen(ledger.bonusChange)}</span>) :
                            (ledger.bonusChange < 0 ?
                                (<span>{"\u2212" + formatMoneyFen(Math.abs(ledger.bonusChange))}</span>) :
                            (<span>-</span>)
                            )
                            ) : "-"}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
