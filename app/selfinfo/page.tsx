import fs from "fs";
import { requireUserOrRedirect } from "@/lib/auth";
import SelfInfoEditPanel from "@/components/SelfInfoEditPanel";
import UserOneline from "@/components/UserOneline";
import NavigateButton from "@/components/NavigateButton";
import Link from "next/dist/client/link";
import PlayerNavigation from "@/components/PlayerNavigation";

export default async function selfInfoPage() {
    const user = await requireUserOrRedirect();
    
    return (
        <main>
            <PlayerNavigation  buttonLogout={false} />
            <div className="card-with-avatar invwindow master-width">
                <Link href="/selfinfo/setavatar">
                    <img className="avatar" src={`/api/avatar/${user.id}`} alt={user.nickname} />
                </Link>
                <div>
                    <UserOneline user={user} />
                    <p>点击头像可更换</p>
                </div>
            </div>
            <SelfInfoEditPanel user={user} />
        </main>
    );
}
