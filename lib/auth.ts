import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { token: sessionCookie },
        include: { user: true,
        },
    });

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    return session.user;
}

export async function authenticateUser(username: string, password: string) {
    const qqidRegex = /^[1-9][0-9]{4,10}$/;
    let user;
    if (qqidRegex.test(username)) {
        user = await prisma.user.findUnique({
            where: { qqid: username },
        });
    } else {
        user = await prisma.user.findUnique({
            where: { username },
        });
    }

    if (!user) {
        return null;
    }

    const passwordHash = user.password;
    const passwordCorrect = await argon2.verify(passwordHash, password);
    if (!passwordCorrect) {
        return null;
    }

    return user;
}

export async function authenticateUserById(userId: number, password: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return null;
    }
    const passwordHash = user.password;
    const passwordCorrect = await argon2.verify(passwordHash, password);
    if (!passwordCorrect) {
        return null;
    }
    return user;
}

export async function requireUserOrRedirect() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login")
    }
    return user;
}

export async function requireStaff() {
    const user = await getCurrentUser();
    if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
        return null;
    }
    return user;
}

export async function requireStaffOrRedirect() {
    const staff = await requireStaff();
    if (!staff) {
        redirect("/login");
    }
    return staff;
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return null;
    }
    return user;
}

export async function requireAdminOrRedirect() {
    const admin = await requireAdmin();
    if (!admin) {
        redirect("/login");
    }
    return admin;
}