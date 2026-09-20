import { messages } from "@/lib/messages"
import { authenticateUser } from "@/lib/auth"
import { getInVenueList } from "@/lib/users";

const successResponse = (data: any) => new Response(JSON.stringify({ success: true, ...data }), {
    status: 200,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function POST(req: Request) {
    const contentType = req.headers.get("Content-Type");
    if (contentType !== "application/json") {
        return new Response(JSON.stringify({ success: false, message: messages.e415_wantJson }), {
            status: 415,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const body = await req.json()
    const { username, password } = body.auth;
    const user = await authenticateUser(username, password);
    if (!user) {
        return new Response(JSON.stringify({ success: false, message: messages.e401_loginCredentials }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const command = body.command;
    if (command.charAt(0) === "j") { //查询几人
        const inVenueList = await getInVenueList();
        if (command.charAt(1) === "n") {
            return successResponse({ list: inVenueList });
        } else {
            return successResponse({ count: inVenueList.length });
        }
    }
    return new Response(JSON.stringify({ success: false, message: messages.e400_peekCommand }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
