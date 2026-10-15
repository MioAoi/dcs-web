import PlayerNavigation from '@/components/PlayerNavigation';
import { BookingSummaryCard } from '@/components/Booking';
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
            <PlayerNavigation buttonLogout={false} />
            <h2>包机场一览</h2>
            <div className="windowlike master-width">
                <p>此页面只显示预告，预约请直接联系工作人员。</p>
            </div>
            {bookings.map((booking) => (
                <BookingSummaryCard key={booking.id} booking={booking} users={booking.users} consoleDesc={consoles.find(c => c.name === booking.console)?.desc || ""} />
            ))}
        </main>
    );
}
