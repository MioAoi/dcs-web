import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentVisit } from "@/lib/visits";
import { ADMISSION_BALANCE } from "@/profiles/rates";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return Response.json({ success: false, error: messages.e401 }, { status: 401 });
    }

    const currentVisit = await getCurrentVisit(user.id);
    if (currentVisit) {
        return Response.json({ success: false, error: messages.e400_alreadyInVenue }, { status: 400 });
    }

    if (user.balance < ADMISSION_BALANCE) {
        return Response.json({ success: false, error: messages.e402_enter }, { status: 402 });
    }

    await prisma.visit.create({
        data: {
            userId: user.id,
            enteredAt: new Date(),
        },
    });
    return Response.json({ success: true });
}
