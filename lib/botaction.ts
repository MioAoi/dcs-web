export const actionList = [
    "getPresentUsers",
    "purchase",
    "getBalance",
    "bindQq",
]

import { getInVenueList } from "@/lib/users"
import { prisma } from "@/lib/prisma";

export async function handleAction({ qqid, action, payload}: { qqid: string, action: string, payload: string }): Promise<Object> {
    if (!actionList.includes(action)) {
        return "error";
    }
    switch (action) {
        case "getPresentUsers":
            return await getInVenueList();
        case "purchase":
            return {
                message: "现在店里没有东西可以买，也不会扣钱"
            };
        case "bindQq":
            return await handleBindQq(qqid, payload);
        default:
            return "error";
    }
}

async function handleBindQq(qqid: string, token: string): Promise<Object> {
    const user = await prisma.user.findUnique({
        where: { 
            pendingQqid: qqid,
            qqBindToken: token
        }
    });
    if (!user) {
        return {
            message: "绑定未站内申请或验证码错误"
        };
    }
    await prisma.user.update({
        where: { pendingQqid: qqid },
        data: { qqid, pendingQqid: null }
    });
    return {
        message: "绑定成功"
    };
}
