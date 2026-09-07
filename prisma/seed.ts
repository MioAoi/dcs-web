import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await argon2.hash(
        process.env.INITIAL_ADMIN_PASSWORD!
    )

    await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            password: passwordHash
        },
        create: {
            username: "admin",
            nickname: "鹳狸猿",
            password: passwordHash,
            role: "ADMIN"
        }
    });
}

main()
    .finally(() => prisma.$disconnect());
    