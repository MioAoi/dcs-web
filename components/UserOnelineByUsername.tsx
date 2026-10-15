import { prisma } from '@/lib/prisma';
import UserOneline from './UserOneline';

export default async function UserOnelineByUsername({ username, clickable = false } : { username: string, clickable?: boolean }) {
    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) return null;

    return <UserOneline user={user} clickable={clickable} />;
}

export async function UserOnelineById({ id, clickable = false } : { id: number, clickable?: boolean }) {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) return null;

    return <UserOneline user={user} clickable={clickable} />;
}
