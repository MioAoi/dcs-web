import NavigateButton from './NavigateButton';
import LogoutButton from './LogoutButton';
export default function PlayerNavigation({ buttonManage, buttonLogout }: { buttonManage: boolean, buttonLogout: boolean }) {
  return (
    <div className="invwindow playerNavigation">
      <NavigateButton href="/selfinfo" buttonText="个人信息" buttonColor="action1" />
      <div/>
      <NavigateButton href="/deposit" buttonText="去充值" buttonColor="action1"/>
      <div/>
      {buttonLogout ? <LogoutButton /> : <NavigateButton href="/dashboard" buttonText="^返回" buttonColor="escape"/>}
      <div/>
      <div/>
      {buttonManage ? <NavigateButton href="/manage" buttonText=">管理页" buttonColor="action2"/> : <div/>}
    </div>
  );
}
