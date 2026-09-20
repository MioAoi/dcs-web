import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff, getCurrentUser } from "@/lib/auth";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const { userId, role, chargeMultiplier, nickname, avatar } = await request.json();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return new Response(JSON.stringify({ success: false, error: messages.e401 }), { status: 401 });
    }

    const staff = await requireStaff();
    if (!staff) {
        if (currentUser.id !== userId) {
            return new Response(JSON.stringify({ success: false, error: messages.e403_otherUser }), { status: 403 });
        }
        if (role || chargeMultiplier) {
            return new Response(JSON.stringify({ success: false, error: messages.e403_requireStaff }), { status: 403 });
        }
    }
    
    const admin = await requireAdmin();
    if (role && !admin) {
        return new Response(JSON.stringify({ success: false, error: messages.e403_requireAdmin }), { status: 403 });
    }

    await prisma.user.update({
        where: { id: userId },
        data: { 
            role: role,
            chargeMultiplier: chargeMultiplier,
            nickname: nickname,
            avatar: avatar,
        }
    });
    return Response.json({ success: true }, { status: 200 });
}
