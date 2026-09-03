import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {getCurrentVisit} from "@/lib/visits";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json(
            { success: false, error: "NOT_LOGGEDIN" },
            { status: 401 }
        );
    }

    const currentVisit = await getCurrentVisit(user.id);
    if (currentVisit) {
        return NextResponse.json(
            { success: false, error: "ALREADY_INVENUE" },
            { status: 400 }
        );
    }

    await prisma.visit.create({
        data: {
            userId: user.id,
            enteredAt: new Date(),
        },
    });
    return NextResponse.json({ success: true });
}
