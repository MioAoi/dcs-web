import { Role } from "@/generated/prisma/browser";

export const roleLabel: Record<Role, string> = {
    ADMIN: "管理员",
    STAFF: "士大夫",
    CUSTOMER: "普通用户"
};
