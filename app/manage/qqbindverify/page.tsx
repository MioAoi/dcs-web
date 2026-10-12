import ManageNavigation from "@/components/ManageNavigation";
import QqVerifyForm from "@/components/QqVerifyForm"; 

export default function QqBindVerifyPage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>QQ绑定验证</h2>
            <QqVerifyForm />
        </main>
    );
}
