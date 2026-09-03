import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie) {
        await prisma.session.deleteMany({
            where: {
                token: sessionCookie.value,
            },
        });
    }

    const response = NextResponse.json({
        success: true,
    });

    response.cookies.delete("session");
    return response;
}
