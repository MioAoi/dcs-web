import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id }= await params.then(p => ({ id: Number(p.id) }));
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            avatar: true,
            qqid: true,
        }
    });
    if (!user) {
        return Response.redirect(
            new URL("/avatars/default.webp", req.url)
        );
    }
    if (user.avatar) {
        return Response.redirect(new URL(`/avatars/${user.avatar}`, req.url));
    }
    if (user.qqid) {
        return Response.redirect(
            new URL(`https://q1.qlogo.cn/g?b=qq&nk=${user.qqid}&s=640`, req.url)
        );
    }
    return Response.redirect(
        new URL("/avatars/default.webp", req.url)
    );
}
