import { changeBalance } from "@/lib/balance";
import { requireStaff } from "@/lib/auth";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const staff = await requireStaff();
    if (!staff) {
        return Response.json({ success: false, message: messages.e403_requireStaff }, { status: 403 });
    }
    const { userId, cashDelta, bonusDelta, note } = await request.json();
    const result = await changeBalance(userId, cashDelta, bonusDelta, note);
    return Response.json({ success: true, result });
}
