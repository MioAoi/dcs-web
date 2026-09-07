"use client";
import { useState } from "react";

export default function SelfInfoEditPanel({ user }: { user: { id: number, nickname: string, qqid: string, pendingQqid: string, qqBindToken: string} }) {
    const [passwordChangeError, setPasswordChangeError] = useState("");
    const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

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

    async function handlePasswordChange({ userId, oldPassword, newPassword }: { userId: number, oldPassword: string, newPassword: string }) {
        const response = await fetch("/api/passwordChange", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, oldPassword, newPassword })
        });
        const result = await response.json();
        if (result.success) {
            setPasswordChangeMessage("密码修改成功，3秒后刷新");
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            setPasswordChangeError(result.error || "密码修改失败");
        }
    }


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

        <div className="windowlike master-width">
            <div className="change-field">
                <span className="current-value">
                    当前密码：<input id="oldPassword" type="password" className="info-input-small short-input"/>
                </span>
                <span className="new-value">
                    <label className="info-label">&#x3000;新密码</label>：
                    <input id="newPassword" type="password" className="info-input-small short-input"/><br/>
                    <label className="info-label">确认密码</label>：<input id="confirmNewPassword" type="password" className="info-input-small short-input"/>
                </span>
                <button className="Button" type="button" onClick={async () => {
                    const oldPassword = (document.getElementById("oldPassword") as HTMLInputElement).value;
                    const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
                    const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement).value;
                    if (newPassword !== confirmNewPassword) {
                        setPasswordChangeError("两次输入的密码不一致");
                        return;
                    }
                    setPasswordChangeError(""); 
                    await handlePasswordChange({ userId: user.id, oldPassword, newPassword });
                }}>提交</button>
                {passwordChangeError && <span className="misc error">{passwordChangeError}</span>}
                {passwordChangeMessage && <span className="misc success">{passwordChangeMessage}</span>}
            </div>
        </div>
    </>);
}
