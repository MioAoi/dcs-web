import { formatFLTToMinutes } from "@/lib/datetime"
import UserOneline from "@/app/components/UserOneline"

export default function PresentUserBrief({ user }: { user: { nickname: string, role: string, enteredAt: Date, chargeMultiplier: number } }) {
    return (
        <div className="master-width windowlike bipartite">
            <UserOneline user={{ ...user, username: null }} />
            <span>从 <span className="info-value-small">{formatFLTToMinutes(user.enteredAt.getTime())}</span></span>
        </div>
    );
}
