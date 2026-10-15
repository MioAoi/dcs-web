import PresentUser from "@/components/PresentUser";
import { loadCurrentPricing } from "@/lib/load";
import { getInVenueList } from "@/lib/users";
import { connection } from "next/server";
import ManageNavigation from "@/components/ManageNavigation";
import { loadConsoles } from "@/lib/load";

export default async function PresentUsersPage() {
    await connection();
    const inVenueUsers = await getInVenueList();
    const currentPricing = await loadCurrentPricing();
    const consoles = await loadConsoles();

    const indicateNemo = inVenueUsers.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <ManageNavigation buttonLogout={true} />
            <h2>在店用户</h2>
            {inVenueUsers.map(({ user, visit, booking }) => (
                <PresentUser
                    key={user.id}
                    user={user}
                    pricing={currentPricing}
                    visit={visit}
                    onelineClickable={true}
                    booking={booking}
                    bookedConsoleDesc={booking ? consoles.find(c => c.name === booking.console)?.desc || null : null}
                />
            ))}
            {indicateNemo && <p className="info">{indicateNemo}</p>}
        </main>
    );
}
