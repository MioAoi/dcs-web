import { getInVenueList } from "@/lib/users";
import PresentUserBrief from "@/app/components/PresentUserBrief";
import NavigateButton from "@/app/components/NavigateButton";
import { connection } from "next/server";

export default async function PresentUsersBriefPage() {
    await connection();
    const users = await getInVenueList();
    const indicateNemo = users.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <h2>在店用户简表</h2>
            {users.map(user => (
                <PresentUserBrief key={user.nickname} user={user} />
            ))}
            {indicateNemo && <p>{indicateNemo}</p>}
            <div className="invwindow master-width">
                <NavigateButton href="/dashboard" buttonText="返回" buttonColor="escape" />
            </div>
            
        </main>
    );
}
