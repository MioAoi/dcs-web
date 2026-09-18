import { getCurrentUser } from "@/lib/auth";
import Link from "next/dist/client/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <div className="master-width generic-vert-grid invwindow">
        <img src="/images/logo.svg" alt="DCStream logo" />
        <Link href="/login" className="Button primary">登录</Link>
        <Link href="/register" className="Button">注册</Link>
        <Link href="/stafflogin" className="Button">管理</Link>
      </div>
    </main>
  );
}
