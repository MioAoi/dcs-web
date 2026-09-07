import { messages } from "@/lib/messages"
import { authenticateUserById } from "@/lib/auth"
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId, oldPassword, newPassword } = await req.json();
    const user = await authenticateUserById(userId, oldPassword);
    if (!user) {
        return Response.json({ error: messages.e401_loginCredentials }, { status: 401 });
    }
    if (user.id !== userId) {
        return Response.json({ error: messages.e403_otherUser }, { status: 403 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
        return Response.json(
            { success: false, error: messages.e400_regPassword },
            { status: 400 }
        );
    }
    
    await prisma.user.update({
        where: { id: userId },
        data: { password: await argon2.hash(newPassword) }
    });
    return Response.json({ success: true }, { status: 200 });
}
