import { formatFLTToMinutes } from "@/lib/datetime"

export default function PresentUserBrief({ user }: { user: { nickname: string, enteredAt: Date } }) {
    return (
        <div className="master-width windowlike">
            <span className="nickname">{user.nickname}</span>&#x3000;进店时间：<span className="info-value">{formatFLTToMinutes(user.enteredAt.getTime())}</span>
        </div>
    );
}
