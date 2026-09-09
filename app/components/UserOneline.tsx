import { roleLabel } from "@/lib/labels";

export default function UserOneline({ user } : { user: { username: string, nickname: string, role: string | null } }) {

    const roleString = (user.role ? roleLabel[user.role] : null);
    return (
        <span><span className="nickname">{user.nickname}</span> <span className="username">{user.username}</span> {roleString}</span>
    );
}
