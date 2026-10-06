import Link from "next/dist/client/link";

export default function UserOneline({ user, clickable = false } : { user: { username: string | null, nickname: string, role: string | null, chargeMultiplier: number, id: number }, clickable?: boolean }) {
    let nicknameClass = "nickname";
    if (user.role === "STAFF")
        nicknameClass += " staff";
    else if (user.role === "ADMIN")
        nicknameClass += " admin";
    else if (user.chargeMultiplier < 1)
        nicknameClass += " sponsor";

    if (clickable) {
        return (
            <Link href={`/manage/users/${user.id}`}>
                <span className={nicknameClass}>{user.nickname}</span> <span className="username">{user.username}</span>
            </Link>
        )
    }

    return (
        <span><span className={nicknameClass}>{user.nickname}</span> <span className="username">{user.username}</span></span>
    )
}
