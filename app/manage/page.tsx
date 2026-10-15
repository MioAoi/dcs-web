import PresentUser from "@/components/PresentUser";
import { loadCurrentPricing } from "@/lib/load";
import { getInVenueList } from "@/lib/users";
import { connection } from "next/server";
import ManageNavigation from "@/components/ManageNavigation";

export default async function PresentUsersPage() {
    await connection();
    const inVenueUsers = await getInVenueList();
    const currentPricing = await loadCurrentPricing();

    const indicateNemo = inVenueUsers.length === 0 ? "当前没有在店用户。" : "";

    return (
        <main>
            <ManageNavigation buttonLogout={true} />
            <h2>在店用户</h2>
            {inVenueUsers.map(({ user, enteredAt, booked }) => (
                <PresentUser
                    key={user.id}
                    user={user}
                    pricing={currentPricing}
                    enteredAt={enteredAt}
                    onelineClickable={true}
                    booked={booked}
                />
            ))}
            {indicateNemo && <p className="info">{indicateNemo}</p>}
        </main>
    );
}
