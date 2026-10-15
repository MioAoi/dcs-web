import ManageNavigation from '@/components/ManageNavigation';
import { BookingCreatePanel, BookingSummaryCard } from '@/components/Booking';
import { prisma } from '@/lib/prisma';
import { loadConsoles } from '@/lib/load';

export default async function BookingPage() {
    const consoles = await loadConsoles();
    const bookings = await prisma.booking.findMany({
        where: {
            endTime: {
                gt: new Date()
            }
        },
        include: {
            users: {
                include: {
                    user: true
                }
            }
        }
    });
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>包机场管理</h2>
            <BookingCreatePanel consoles={consoles} />
            <h3>当前包机场事件</h3>
            {bookings.map((booking) => (
                <BookingSummaryCard key={booking.id} booking={booking} users={booking.users} consoleDesc={consoles.find(c => c.name === booking.console)?.desc || ""} />
            ))}
        </main>
    );
}
