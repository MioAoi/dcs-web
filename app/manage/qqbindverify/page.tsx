import Link from "next/link";
import QqVerifyForm from "@/app/components/QqVerifyForm"; 

export default function QqBindVerifyPage() {
    return (
        <main>
            <h2>QQ绑定验证</h2>
            <QqVerifyForm />
            <div className="master-width invwindow generic-vert-grid">
                <Link href="/manage" className="Button escape">▲返回管理</Link>
            </div>
        </main>
    );
}
