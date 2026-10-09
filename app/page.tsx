import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import NavigateButton from "@/app/components/NavigateButton";

export default async function Home() {
    const user = await getCurrentUser();
    if (user) {
        redirect("/dashboard");
    }

    return (
        <main>
            <div className="master-width generic-vert-grid invwindow">
                <img src="/images/logo.svg" alt="DCStream logo" />
                <NavigateButton href="/login" buttonColor="primary" buttonText="登录" />
                <NavigateButton href="/register" buttonText="注册" />
                <NavigateButton href="/stafflogin" buttonText="管理" />
            </div>
        </main>
    );
}
