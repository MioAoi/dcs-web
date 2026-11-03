import NavigateButton from "@/components/NavigateButton"
import ManageNavigation from "@/components/ManageNavigation";

export default function AdvancedManagePage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>高级管理</h2>
            <div className="invwindow master-width generic-vert-grid">
                <NavigateButton href="/manage/advanced/bots" buttonText="Bot 设置" />
                <NavigateButton href="/manage/advanced/goods" buttonText="商品设置" />
            </div>
        </main>
    );
}
