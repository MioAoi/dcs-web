import { getInVenueList } from "@/lib/users";
import NavigateButton from "@/app/components/NavigateButton";
import { requireUserOrRedirect } from "@/lib/auth";
import PresentUser from "../components/PresentUser";
import PlayerNavigation from "../components/PlayerNavigation";

export default async function PresentUsersBriefPage() {
    const user = await requireUserOrRedirect();
    const users = await getInVenueList();
    const indicateNemo = users.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <PlayerNavigation buttonManage={user.role === "STAFF" || user.role === "ADMIN"} buttonLogout={false} />
            <h2>在店用户简表</h2>
            {users.map((user) => (
                <PresentUser
                    key={user.id}
                    user={user}
                    pricing={null}
                />
            ))}
            {indicateNemo && <p>{indicateNemo}</p>}
            <div className="invwindow master-width">
                <NavigateButton href="/dashboard" buttonText="返回" buttonColor="escape" />
            </div>
            
        </main>
    );
}
