export default function UserOneline({ user } : { user: { username: string | null, nickname: string, role: string | null, chargeMultiplier: number } }) {
    let nicknameClass = "nickname";
    if (user.role === "STAFF")
        nicknameClass += " staff";
    else if (user.role === "ADMIN")
        nicknameClass += " admin";
    else if (user.chargeMultiplier < 1)
        nicknameClass += " sponsor";

    return (
        <span><span className={nicknameClass}>{user.nickname}</span> <span className="username">{user.username}</span></span>
    );
}
