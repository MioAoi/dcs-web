import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateUser } from "@/lib/auth";
import crypto from "crypto";
import { messages } from "@/lib/messages";

export async function POST(request: Request) {
    const body = await request.json();

    const user = await authenticateUser(body.username, body.password);

    if (!user) {
        return NextResponse.json({ success: false, error: messages.e401_loginCredentials }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 604800000);
    await prisma.session.create({
        data: {
            token,
            userId: user.id,
            expiresAt,
        },
    });

    const response = NextResponse.json({
        success: true,
    });

    response.cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
    return response;
}
