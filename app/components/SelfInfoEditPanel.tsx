"use client";

export default function SelfInfoEditPanel({ user }: { user: { id: number, nickname: string, qqid: string, pendingQqid: string, qqBindToken: string} }) {
    return (<>
        <div className="windowlike master-width">
            <div className="change-field bare">
                <span className="current-value">当前昵称：<span className="info-value-small">{user.nickname}</span></span>
                <span className="new-value"><label className="info-label">&#x3000;新昵称</label>：<input id="nickname" type="text" className="info-input-small short-input" defaultValue={user.nickname}/></span>
                <button className="Button" type="button" onClick={async () => {
                    const newNickname = (document.getElementById("nickname") as HTMLInputElement).value;
                    await handleChange({ userId: user.id, nickname: newNickname });
                }}>提交</button>
            </div>
        </div>
        <div className="windowlike master-width">
            <div className="change-field">
                <span className="current-value">
                    当前QQ：<span className="info-value-small">{user.qqid || "未绑定"}</span><br/>
                    待绑QQ：<span className="info-value-small">{user.pendingQqid || "无"}</span>
                </span>
                <span className="new-value"><label className="info-label">&#x3000;新QQ</label>：<input id="qqid" type="text" className="info-input-small short-input"/></span>
                <button className="Button" type="button" onClick={async () => {
                    const newQqid = (document.getElementById("qqid") as HTMLInputElement).value;
                    await handleQqChange({ userId: user.id, qqid: newQqid });
                }}>提交</button>
                {user.qqBindToken ? <span className="misc">绑定验证码：<br/><span className="info-value-small text-token">{user.qqBindToken}</span><br/>请联系工作人员完成绑定</span> : null}
            </div>
        </div>
    </>);
}

async function handleChange(newPartialUser : { userId: number, nickname?: string, qqid?: string }) {
    const response = await fetch("/api/generaluseredit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPartialUser)
    });
    const result = await response.json();
    if (result.success) {
        location.reload();
    }
}

async function handleQqChange({ userId, qqid }: { userId: number, qqid: string }) {
    const response = await fetch("/api/qqBindInitiate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, qqid })
    });
    const result = await response.json();
    if (result.success) {
        location.reload();
    }
}
