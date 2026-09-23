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
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/avatars/default.webp`,
            },
        });
    }
    if (user.avatar) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/avatars/${user.avatar}`,
            },
        });
    }
    if (user.qqid) {
        return Response.redirect(
            new URL(`https://q1.qlogo.cn/g?b=qq&nk=${user.qqid}&s=640`, req.url)
        );
    }
    return new Response(null, {
        status: 302,
        headers: {
            Location: `/avatars/default.webp`,
        },
    });
}
