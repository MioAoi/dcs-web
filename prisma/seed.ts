import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
});
const prisma = new PrismaClient({ adapter });

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
            role: "ADMIN",
            createdAt: new Date()
        }
    });
}

main()
    .finally(() => prisma.$disconnect());
    