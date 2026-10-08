import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { bytesToBase260 } from "@/lib/base260"

export async function POST(request: Request) {
    const oldKey = (await request.json()).oldKey;
    let newKey = bytesToBase260(crypto.randomBytes(16));
    while (await prisma.bot.findUnique({ where: { key: newKey } })) {
        newKey = bytesToBase260(crypto.randomBytes(16));
    }
    await prisma.bot.update({
        where: { key: oldKey },
        data: { key: newKey }
    });
    return Response.json({ newKey });
}
