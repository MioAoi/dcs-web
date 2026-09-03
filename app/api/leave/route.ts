import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { completeVisit } from "@/lib/visits";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    try {
        const result = await completeVisit(user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
