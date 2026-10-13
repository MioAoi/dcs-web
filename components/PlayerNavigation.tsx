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
            <div/>
            <NavigateButton href="/deposit" buttonText="[deposit]去充值" buttonColor="action1"/>
            <NavigateButton href="/about" buttonText="[info]关于我们" buttonColor="action1" />
            {buttonLogout ? <LogoutButton /> : <NavigateButton href="/dashboard" buttonText="[back]返回" buttonColor="escape"/>}
            <WhosinButton inVenueCount={inVenueCount} />
            <div/>
            {await requireStaff() ? <NavigateButton href="/manage" buttonText="[key]管理页" buttonColor="action2"/> : <div/>}
        </div>
    );
}
