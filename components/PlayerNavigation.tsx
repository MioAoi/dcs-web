import NavigateButton from './NavigateButton';
import { WhosinButton } from './NavigateButton';
import LogoutButton from './LogoutButton';
import { getInVenueCount } from '@/lib/users';
import { requireStaff } from '@/lib/auth'

export default async function PlayerNavigation({ buttonLogout }: { buttonLogout: boolean, }) {
    const inVenueCount = await getInVenueCount();
    return (
        <div className="invwindow playerNavigation">
            <NavigateButton href="/selfinfo" buttonText="[account]个人信息" buttonColor="action1" />
            <NavigateButton href="/userbooking" buttonText="[event]包 机 场" />
            <NavigateButton href="/deposit" buttonText="[deposit]去 充 值" buttonColor="action1"/>
            <NavigateButton href="/about" buttonText="[info]关于我们" buttonColor="action1" />
            {buttonLogout ? <LogoutButton /> : <NavigateButton href="/dashboard" buttonText="[back]返&#x3000;回" buttonColor="escape"/>}
            <WhosinButton inVenueCount={inVenueCount} />
            <NavigateButton href="/shop" buttonText="[Shop]商&#x3000;城" buttonColor="action1"/>
            {await requireStaff() ? <NavigateButton href="/manage" buttonText="[key]管 理 页" buttonColor="action2"/> : <div/>}
        </div>
    );
}
