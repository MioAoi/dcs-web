import { messages } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { handleAction } from "@/lib/botaction"

export async function POST(req: Request) {
    const contentType = req.headers.get("Content-Type");
    if (contentType !== "application/json") {
        return Response.json({ success: false, message: messages.e415_wantJson }, {
            status: 415,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const body = await req.json()
    if (![body.qqid, body.key, body.action, body.payload].every(x => typeof x === "string")) {
        return Response.json({ success: false, message: messages.e400 }, {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const bot = await prisma.bot.findUnique({
        where: {
            key: body.key,
        },
    });
    if (!bot) {
        return Response.json({ success: false, message: messages.e401_botKey }, {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const permissions = bot.permissions.split(",");
    if (!permissions.includes(body.action)) {
        return Response.json({ success: false, message: messages.e403 }, {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const result = await handleAction(body);
    if (result == "error") {
        return Response.json({ success: false, message: messages.e500 }, {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return Response.json({ success: true, data: result });
}
