import { prisma } from "@/lib/prisma";
import { bytesToBase260 } from "@/lib/base260";
import { getCurrentUser } from "@/lib/auth";
import { messages } from "@/lib/messages";
import crypto from "crypto";

export async function POST(req: Request) {
    const { userId, qqid } = await req.json();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return Response.json({ success: false, error: messages.e401 }, { status: 401 });
    }
    if (currentUser.id !== userId) {
        return Response.json({ success: false, error: messages.e403_otherUser }, { status: 403 });
    }
    const token = bytesToBase260(crypto.randomBytes(16));
    await prisma.user.update({
        where: { id: userId },
        data: {
            qqBindToken: token,
            pendingQqid: qqid
        }
    });
    return Response.json({ success: true, token }, { status: 200 });
}
