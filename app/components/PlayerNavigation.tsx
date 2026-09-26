import NavigateButton from './NavigateButton';
import { WhosinButton } from './NavigateButton';
import LogoutButton from './LogoutButton';
import { getInVenueCount } from '@/lib/users';
export default async function PlayerNavigation({ buttonManage, buttonLogout }: { buttonManage: boolean, buttonLogout: boolean, }) {
    const inVenueCount = await getInVenueCount();
    return (
        <div className="invwindow playerNavigation">
            <NavigateButton href="/selfinfo" buttonText="个人信息" buttonColor="action1" />
            <div/>
            <NavigateButton href="/deposit" buttonText="去充值" buttonColor="action1"/>
            <div/>
            {buttonLogout ? <LogoutButton /> : <NavigateButton href="/dashboard" buttonText="^返回" buttonColor="escape"/>}
            <WhosinButton inVenueCount={inVenueCount} />
            <div/>
            {buttonManage ? <NavigateButton href="/manage" buttonText=">管理页" buttonColor="action2"/> : <div/>}
        </div>
    );
}
