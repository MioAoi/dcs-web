import { prisma } from "@/lib/prisma";

type user = {
    id: number;
    username: string;
    nickname: string;
    role: string;
    balance: number;
    chargeMultiplier: number;
}

export async function userQuery(q: string, smart: boolean): Promise<{users: user[], exact: boolean}> {
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

export async function getInVenueCount(): Promise<number> {
    const count = await prisma.visit.count({
        where: {
            leftAt: null
        }
    });
    return count;
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
        id: visit.user.id,
        username: visit.user.username,
        nickname: visit.user.nickname,
        role: visit.user.role,
        balance: visit.user.balance,
        chargeMultiplier: visit.user.chargeMultiplier,

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
