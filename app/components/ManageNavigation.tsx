import NavigateButton from './NavigateButton';
import LogoutButton from './LogoutButton';

export default async function ManageNavigation({ buttonLogout }: { buttonLogout: boolean }) {
    return (
        <div className="invwindow playerNavigation">
            <NavigateButton href="/manage/users" buttonText="[user]查看用户" />
            <NavigateButton href="/manage/qqbindverify" buttonText="[fingerprint]QQ绑定" />
            <NavigateButton href="/manage/outstanding" buttonText="[user!]欠费用户" />
            <NavigateButton href="/chargecalc" buttonText="[calc]价格试算" />
            {buttonLogout ? <LogoutButton /> : <NavigateButton href="/manage" buttonText="[back]返回管理" buttonColor="escape"/>}
            <NavigateButton href="/manage/histogram" buttonText="[stats]图表" />
            <NavigateButton href="/manage/leaderboard" buttonText="[ranking]消费榜" />
            <NavigateButton href="/dashboard" buttonText="[nokey]玩家页" buttonColor="escape2" />
        </div>
    );
}
