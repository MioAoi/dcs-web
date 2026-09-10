import { prisma } from "@/lib/prisma";

type user = {
    id: number;
    username: string;
    nickname: string;
    role: string;
    balance: number;
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
