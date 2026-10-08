import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { botKey } = await request.json();
    const result = await prisma.bot.delete({
        where: { key: botKey }
    });
    return Response.json({ success: !!result });
}
