import { prisma } from "@/lib/prisma";
import { messages } from "@/lib/messages";
import argon2 from "argon2";

export async function POST(request: Request) {
    const { username, password, nickname } = await request.json();

    if (!validateUsername(username)) {
        return Response.json(
            { success: false, error: messages.e400_regUsername },
            { status: 400 }
        );
    }

    if (typeof password !== "string" || password.length < 6) {
        return Response.json(
            { success: false, error: messages.e400_regPassword },
            { status: 400 }
        );
    }

    const existingUser = await checkExistingUser(username);
    if (existingUser) {
        return Response.json(
            { success: false, error: messages.e409_regUsername },
            { status: 409 }
        );
    }

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
        data: {
            username: username,
            password: passwordHash,
            nickname: nickname,
            createdAt: new Date(),
        },
    });

    return Response.json(
        { success: true },
        { status: 201 }
    );
}

function validateUsername(username: string): boolean {
    if (typeof username !== "string") {
        return false;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const qqidRegex = /^[1-9][0-9]{4,10}$/;
    return usernameRegex.test(username) && !qqidRegex.test(username);
}

async function checkExistingUser(username: string): Promise<boolean> {
    return prisma.user.findUnique({
        where: {
            username: username,
        },
    }).then((user) => !!user);
}
