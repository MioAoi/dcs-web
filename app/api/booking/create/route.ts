import { prisma } from "@/lib/prisma";

async function createBooking({ startTime, endTime, console, usernames }: { startTime: Date, endTime: Date, console: string, usernames: string[] }) {
    const userIds = await prisma.user.findMany({
        where: {
            username: {
                in: usernames
            }
        },
        select: {
            id: true
        }
    }).then(users => users.map(user => user.id));

    const booking = await prisma.booking.create({
        data: {
            startTime,
            endTime,
            console,
            users: {
                create: userIds.map(userId => ({
                    user: {
                        connect: { id: userId }
                    }
                }))
            }
        }
    });
    return booking;
}

export async function POST(request: Request) {
    const body = await request.json();
    const booking = await createBooking({
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        console: body.console,
        usernames: body.usernames
    });
    return new Response(JSON.stringify(booking), { status: 200 });
}
