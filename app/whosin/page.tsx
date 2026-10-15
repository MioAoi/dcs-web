import { getInVenueList } from "@/lib/users";
import { requireUserOrRedirect } from "@/lib/auth";
import PresentUser from "@/components/PresentUser";
import PlayerNavigation from "@/components/PlayerNavigation";
import { loadConsoles } from "@/lib/load";

export default async function PresentUsersBriefPage() {
    await requireUserOrRedirect();
    const inVenueUsers = await getInVenueList();
    const consoles = await loadConsoles();
    const indicateNemo = inVenueUsers.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <PlayerNavigation  buttonLogout={false} />
            <h2>在店用户</h2>
            {inVenueUsers.map(({ user, visit, booking }) => (
                <PresentUser
                    key={user.id}
                    user={user}
                    visit={visit}
                    pricing={null}
                    booking={booking}
                    onelineClickable={false}
                    bookedConsoleDesc={booking ? consoles.find(c => c.name === booking.console)?.desc || null : null}
                />
            ))}
            {indicateNemo && <p>{indicateNemo}</p>}
        </main>
    );
}
