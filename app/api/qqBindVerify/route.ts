import { prisma } from "@/lib/prisma";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const { pendingQqid, token } = await request.json();
    const user = await prisma.user.findFirst({
        where: {
            pendingQqid,
            qqBindToken: token
        }
    });
    if (!user) {
        return Response.json({ success: false, error: messages.e400_qqBindVerify }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            qqid: user.pendingQqid,
            pendingQqid: null,
            qqBindToken: null
        }
    });
    return Response.json({ success: true }, { status: 200 });
}
