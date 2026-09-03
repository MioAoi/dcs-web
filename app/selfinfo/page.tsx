import { requireUserOrRedirect } from "@/lib/auth";

export default async function selfInfoPage() {
    await requireUserOrRedirect();
    return (
        <div>
            <h2>个人信息</h2>
        </div>
    );
}