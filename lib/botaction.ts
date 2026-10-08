export const actionList = [
    "getPresentUsers",
    "purchase",
    "getBalance",
    "bindQq",
]

import { getInVenueList } from "@/lib/users"
import { prisma } from "@/lib/prisma";

export async function handleAction({ qqid, action, payload}: { qqid: string, action: string, payload: string }): Promise<string> {
    if (!actionList.includes(action)) {
        return "";
    }
    switch (action) {
        case "getPresentUsers":
            const result = await getInVenueList();
            return JSON.stringify(result);
        case "purchase":
            return JSON.stringify({
                message: "现在店里没有东西可以买，也不会扣钱"
            });
        case "bindQq":
            return await handleBindQq(qqid, payload);
        default:
            return "";
    }
}

async function handleBindQq(qqid: string, token: string): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { 
            pendingQqid: qqid,
            qqBindToken: token
        }
    });
    if (!user) {
        return JSON.stringify({
            message: "绑定未站内申请或验证码错误"
        });
    }
    await prisma.user.update({
        where: { pendingQqid: qqid },
        data: { qqid, pendingQqid: null }
    });
    return JSON.stringify({
        message: "绑定成功"
    });
}
