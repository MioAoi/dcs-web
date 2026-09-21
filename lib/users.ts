import { prisma } from "@/lib/prisma";
import fs from 'fs';
import type { User } from "@/generated/prisma/client";

export async function userQuery(q: string, smart: boolean): Promise<{users: User[], exact: boolean}> {
    // 开启智能查询时，唯一一致和完全一致的情况返回单体
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: q } },
                { nickname: { contains: q } },
                { qqid: { contains: q } },
            ]
        }
    });

    if (smart) {
        if (users.length === 1) {
            return { users, exact: true };
        }

        users.forEach((user) => {
            if (user.username === q || user.qqid === q) {
                return({ users: [user], exact: true });
            }
        });
    }

    return { users, exact: false };
}

export async function getInVenueCount() {
    const users = await getInVenueList();
    let { customers, staffs } = { customers: 0, staffs: 0 };
    users.forEach(user => {
        if (user.role == 'CUSTOMER') {
            customers++;
        } else {
            staffs++;
        }
    });
    return {
        customers,
        staffs,
        total: customers + staffs
    }
}

export async function getInVenueList() {
    const visits = await prisma.visit.findMany({
        where: {
            leftAt: null
        },
        include: {
            user: true
        }
    });
    return visits.map(visit => ({
        ...visit.user,

        enteredAt: visit.enteredAt
    }));
}

export async function getUserCoupons(userId: number) {
    const coupons = await prisma.coupon.findMany({
        where: {
            userId
        }
    });
    return coupons;
}

export async function getUserAvailDepositDiets(userId: number) {
    const allDiets = JSON.parse(fs.readFileSync('profiles/deposit_diets.json', 'utf-8'));
    const now = new Date();
    let availDiets = [];
    for (const diet of allDiets) {
        if (now < new Date(diet.availFrom)) {
            continue;
        }
        if (diet.availTill && now > new Date(diet.availTill)) {
            continue;
        }
        let usedCount = 0;
        if (diet.stock !== null) {
            // 同名充值套餐只在有效日期范围内计使用次数
            usedCount = await prisma.deposit.count({
                where: {
                    userId,
                    dietName: diet.name,
                    createdAt: {
                        gte: diet.availFrom ? new Date(diet.availFrom) : new Date(0),
                        lte: diet.availTill ? new Date(diet.availTill) : new Date()
                    }
                }
            });
            if (usedCount >= diet.stock) {
                continue;
            }
        }
        availDiets.push({
            ...diet,
            remaining: diet.stock !== null ? diet.stock - usedCount : null
        });
    }

    return availDiets;

}

export async function getUserLatestVisits(userId: number, limit: number = 15) {
    const visits = await prisma.visit.findMany({
        where: {
            userId
        },
        orderBy: {
            enteredAt: 'desc'
        },
        take: limit
    });
    return visits;
}

export async function getUserLatestLedgers(userId: number, limit: number = 15) {
    const ledgers = await prisma.ledger.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: limit
    });
    return ledgers;
}
