import NavigateButton from './NavigateButton';
import LogoutButton from './LogoutButton';

export default async function ManageNavigation({ buttonLogout }: { buttonLogout: boolean }) {
    return (
        <div className="invwindow playerNavigation">
            <NavigateButton href="/manage/users" buttonText="查看用户" />
            <NavigateButton href="/manage/qqbindverify" buttonText="QQ绑定" />
            <NavigateButton href="/manage/outstanding" buttonText="欠费用户" />
            <NavigateButton href="/chargecalc" buttonText="价格试算" />
            {buttonLogout ? <LogoutButton /> : <NavigateButton href="/manage" buttonText="^返回管理" buttonColor="escape"/>}
            <NavigateButton href="/manage/histogram" buttonText="图表" />
            <div/>
            <NavigateButton href="/dashboard" buttonText="<玩家页" buttonColor="escape2" />
        </div>
    );
}
