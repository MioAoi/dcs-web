import { getCurrentUser } from "@/lib/auth";
import { getCurrentVisit, completeVisit } from "@/lib/visits";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return Response.json({ success: false, error: messages.e401 }, { status: 401 });
    }
    
    const currentVisit = await getCurrentVisit(user.id);
    if (!currentVisit) {
        return Response.json({ success: false, error: messages.e400_notInVenue }, { status: 400 });
    }

    await completeVisit(user.id);
    return Response.json({ success: true });
}
