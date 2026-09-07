import { roleLabel } from "@/lib/labels";

export default function UserOneline({ user } : { user: { id: number, username: string, nickname: string, role: string } }) {

    const roleString = (user.role ? roleLabel[user.role] : "棍母");
    return (
        <><span className="nickname">{user.nickname}</span> <span className="username">{user.username}</span>, {roleString}</>
    );
}
