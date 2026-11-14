import PresentUser from "@/components/PresentUser";
import { getInVenueList } from "@/lib/users";
import { connection } from "next/server";
import ManageNavigation from "@/components/ManageNavigation";
import { loadConsoles, loadCurrentPricingv2 } from "@/lib/load";
import { calculateCharge } from "@/lib/pricingv2";

export default async function PresentUsersPage() {
    await connection();
    const inVenueUsers = await getInVenueList();
    const currentPricing = await loadCurrentPricingv2();
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
                    manageView={true}
                    visit={visit}
                    antcpCharge={booking ? undefined : calculateCharge(visit!.enteredAt, new Date(), currentPricing.rater).total * user.chargeMultiplier}
                    booking={booking}
                    bookedConsoleDesc={booking ? consoles.find(c => c.name === booking.console)?.desc || null : null}
                />
            ))}
            {indicateNemo && <p className="info">{indicateNemo}</p>}
        </main>
    );
}
