import { prisma } from "@/lib/prisma";
import { roleLabel } from "@/lib/labels";

export async function userOneline(userId: number, username: string, nickname: string, role: string) {
    if (!(username && nickname && role)) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        }); if (user) {
            username = user.username;
            nickname = user.nickname;
            role = user.role;
        }
    }
    const roleString = (role ? roleLabel[role] : "棍母");
    return `<div><span className="nickname">${nickname}</span> <span className="username">${username}</span>, ${roleString}</div>`;
}
