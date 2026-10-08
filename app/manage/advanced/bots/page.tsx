import { prisma } from "@/lib/prisma";
import { actionList } from "@/lib/botaction";
import BotSummaryCard from "@/app/components/BotSummaryCard";
import BotCreatePanel from "@/app/components/BotCreatePanel";
import ManageNavigation from "@/app/components/ManageNavigation";

export default async function BotsPage() {
    const bots = await prisma.bot.findMany();
    return (
        <main>
            <ManageNavigation buttonLogout={false}/>
            <h2>Bot 管理</h2>
            <BotCreatePanel />
            {bots.sort((a, b) => a.nickname.localeCompare(b.nickname)).map(bot => (
                <BotSummaryCard key={bot.key} nickname={bot.nickname} botKey={bot.key} permissions={bot.permissions} actionList={actionList} />
            ))}
        </main>
    );
}
