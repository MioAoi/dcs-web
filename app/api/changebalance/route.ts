import { NextResponse } from "next/server";
import { changeBalance } from "@/lib/balance";
import { requireStaff } from "@/lib/auth";
export async function POST(request: Request) {
    const staff = await requireStaff();
    if (!staff) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }
    try {
        const { userId, cashDelta, bonusDelta, note } = await request.json();
        const result = await changeBalance(userId, cashDelta, bonusDelta, note);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
