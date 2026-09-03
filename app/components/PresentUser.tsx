import StayTimer from "./StayTimer";

export default function PresentUser({visit}) {
    return (
        <div className="windowlike">
            <b>{visit.user.nickname}</b> <span className="username">{visit.user.username}</span><br/>
            进店时间：{visit.enteredAt.toLocaleTimeString()}<br/>
            <StayTimer
                enterTime={visit.enteredAt}
            />
        </div>
    )
}
