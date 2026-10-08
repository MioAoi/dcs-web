import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { botKey, permissions } = await request.json();
    await prisma.bot.update({
        where: { key: botKey },
        data: { permissions }
    });
    return Response.json({ success: true });
}
