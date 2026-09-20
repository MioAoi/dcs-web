import { requireUserOrRedirect } from "@/lib/auth";
import SelfInfoEditPanel from "@/app/components/SelfInfoEditPanel";
import UserOneline from "@/app/components/UserOneline";
import Link from "next/dist/client/link";

export default async function selfInfoPage() {
    const user = await requireUserOrRedirect();
    
    return (
        <main>
            <div className="card-with-avatar invwindow master-width">
                <Link href="/selfinfo/setavatar">
                    <img className="avatar" src={user.avatar ? `/avatars/${user.avatar}` : user.qqid ? `https://q.qlogo.cn/g?b=qq&nk=${user.qqid}&s=640` : `/avatars/default.webp`} alt={user.nickname} />
                </Link>
                <div>
                    <UserOneline user={user} />
                    <p>点击头像可更换</p>
                </div>
            </div>
            <SelfInfoEditPanel user={user} />
            <div className="master-width invwindow">
                <Link href="/dashboard" className="Button escape">返回</Link>
            </div>
        </main>
    );
}
