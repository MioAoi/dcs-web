import { getInVenueList } from "@/lib/users";
import { requireUserOrRedirect } from "@/lib/auth";
import PresentUser from "@/components/PresentUser";
import PlayerNavigation from "@/components/PlayerNavigation";

export default async function PresentUsersBriefPage() {
    await requireUserOrRedirect();
    const inVenueUsers = await getInVenueList();
    const indicateNemo = inVenueUsers.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <PlayerNavigation  buttonLogout={false} />
            <h2>在店用户</h2>
            {inVenueUsers.map(({ user, enteredAt, booked }) => (
                <PresentUser
                    key={user.id}
                    user={user}
                    enteredAt={enteredAt}
                    pricing={null}
                    booked={booked}
                    onelineClickable={false}
                />
            ))}
            {indicateNemo && <p>{indicateNemo}</p>}
        </main>
    );
}
