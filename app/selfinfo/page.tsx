import { requireUserOrRedirect } from "@/lib/auth";
import SelfInfoEditPanel from "@/app/components/SelfInfoEditPanel";
import UserOneline from "@/app/components/UserOneline";
import NavigateButton from "@/app/components/NavigateButton";
import Link from "next/dist/client/link";

export default async function selfInfoPage() {
    const user = await requireUserOrRedirect();
    
    return (
        <main>
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
            <div className="master-width invwindow">
                <NavigateButton href="/dashboard" buttonColor="escape" buttonText="^返回主界面"/>
            </div>
        </main>
    );
}
