import NavigateButton from "@/app/components/NavigateButton"
import ManageNavigation from "@/app/components/ManageNavigation";

export default function AdvancedManagePage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>高级管理</h2>
            <div className="invwindow master-width">
                <NavigateButton href="/manage/advanced/bots" buttonText="Bot 设置" />
            </div>
        </main>
    );
}
