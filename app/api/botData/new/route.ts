import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { bytesToBase260 } from "@/lib/base260";

export async function POST(req: Request) {
    const { nickname } = await req.json();
    const key = bytesToBase260(crypto.randomBytes(16));
    const bot = await prisma.bot.create({
        data: {
            key,
            nickname,
            permissions: "",
        }
    });
    return new Response(JSON.stringify(bot));
}
