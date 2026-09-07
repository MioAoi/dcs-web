import { requireUserOrRedirect } from "@/lib/auth";
import SelfInfoEditPanel from "@/app/components/SelfInfoEditPanel";
import UserOneline from "@/app/components/UserOneline";
import Link from "next/dist/client/link";

export default async function selfInfoPage() {
    const user = await requireUserOrRedirect();
    
    return (
        <main>
            <h2>个人信息</h2>
            <p><UserOneline user={user} /></p>
            <SelfInfoEditPanel user={user} />
            <div className="master-width invwindow">
                <Link href="/dashboard" className="Button escape">返回</Link>
            </div>
        </main>
    );
}
