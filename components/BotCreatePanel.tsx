"use client";
export default function BotCreatePanel() {
    async function handleNewBot() {
        const nickname = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
        const response = await fetch("/api/botData/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nickname })
        });
        const data = await response.json();
        location.reload();
    }
    return (
        <div className="windowlike master-width leftwide">
            <div className="name">
                <label className="info-label">名称</label><br/>
                <input type="text" className="medium-input info-input" />
            </div>
            <button className="buttonCreate" onClick={handleNewBot}>新建 Bot</button>
        </div>
    );
}
