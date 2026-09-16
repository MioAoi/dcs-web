import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentVisit } from "@/lib/visits";
import { loadCurrentPricing } from "@/lib/load";
import { messages } from "@/lib/messages";
import { bytesToBase260 } from "@/lib/base260";
import crypto from "crypto";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return Response.json({ success: false, error: messages.e401 }, { status: 401 });
    }

    const currentVisit = await getCurrentVisit(user.id);
    if (currentVisit) {
        return Response.json({ success: false, error: messages.e400_alreadyInVenue }, { status: 400 });
    }

    const { admissionBalance } = loadCurrentPricing();
    if (user.balance < admissionBalance) {
        return Response.json({ success: false, error: messages.e402_enter }, { status: 402 });
    }

    await prisma.visit.create({
        data: {
            userId: user.id,
            enteredAt: new Date(),
            token: bytesToBase260(crypto.randomBytes(16), true),
        },
    });
    return Response.json({ success: true });
}
