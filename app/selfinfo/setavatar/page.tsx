import fs from "fs";

export default function SetAvatarPage() {
    const avatars = JSON.parse(fs.readFileSync("public/avatars/avatars.json", "utf-8"));
    
    return (
        <main>
            <h2>设置头像</h2>
            <div className="master-width windowlike avatar-selection">
                <div>
                    <img src={`/avatars/default.webp`} alt="不设置" />
                    <i>读取QQ</i>
                </div>
            {avatars.map((avatar: { filename: string; desc: string }) => (
                <div key={avatar.filename}>
                    <img src={`/avatars/${avatar.filename}`} alt={avatar.desc} />
                    <p>{avatar.desc}</p>
                </div>
            ))}
            </div>
        </main>
    );
}
