import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/auth";

export async function POST(request: Request) {
    const staff = await requireStaff();
    if (!staff) {
        return new Response(JSON.stringify({ success: false, error: "Access denied" }), { status: 403 });
    }
    const { userId, role, chargeMultiplier } = await request.json();
    const admin = await requireAdmin();
    if (role && !admin) {
        return new Response(JSON.stringify({ success: false, error: "Access denied" }), { status: 403 });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { 
                role: role,
                chargeMultiplier: chargeMultiplier,
            }
        });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}
