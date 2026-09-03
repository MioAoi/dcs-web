import Link from "next/dist/client/link";

export default function ToManageDashButton() {
    return (
        <Link href="/manage">
            <div className="Button escape">▲管理面板</div>
        </Link>
    );
}
