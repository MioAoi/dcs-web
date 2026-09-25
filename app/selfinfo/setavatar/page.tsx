import fs from "fs";
import SetAvatarPanel from "@/app/components/SetAvatarPanel";
import { requireUserOrRedirect } from "@/lib/auth";
import PlayerNavigation from "@/app/components/PlayerNavigation";

export default async function SetAvatarPage() {
    const avatars = JSON.parse(fs.readFileSync("public/avatars/avatars.json", "utf-8"));
    const user = await requireUserOrRedirect();
    
    return (
        <main>
            <PlayerNavigation buttonManage={user.role == "STAFF" || user.role == "ADMIN"} buttonLogout={false} />
            <h2>设置头像</h2>
            <div className="master-width invwindow bipartite">
                <div>
                    当前头像：
                    <img className="avatar inline" src={`/api/avatar/${user.id}`} alt={user.nickname} />
                </div>
            </div>
            <SetAvatarPanel avatars={avatars} userId={user.id} />
        </main>
    );
}
