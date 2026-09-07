import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { completeVisit } from "@/lib/visits";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const staff = await requireStaff();
    if (!staff) {
        return NextResponse.json({ success: false, error: messages.e403_requireStaff }, { status: 403 });
    }

    const { userId } = await request.json();
    await completeVisit(userId);
    return Response.json({ success: true });
}
