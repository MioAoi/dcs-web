import fs from "fs";
import SetAvatarPanel from "@/app/components/SetAvatarPanel";
import { requireUserOrRedirect } from "@/lib/auth";

export default async function SetAvatarPage() {
    const avatars = JSON.parse(fs.readFileSync("public/avatars/avatars.json", "utf-8"));
    const user = await requireUserOrRedirect();
    
    return (
        <main>
            <h2>设置头像</h2>
            <SetAvatarPanel avatars={avatars} userId={user.id} />
        </main>
    );
}
