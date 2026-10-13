import PlayerNavigation from '@/components/PlayerNavigation'
import UserOnelineByUsername from '@/components/UserOnelineByUsername'
import fs from 'fs'
import path from 'path';

export default function AboutPage() {
    const { explicitStaffList, staffList } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'profiles', 'staffs.json'), 'utf-8'));

    return (
        <main>
            <PlayerNavigation buttonLogout={false}  />
            <h2>关于我们</h2>
            <div className="windowlike master-width">
                {explicitStaffList.map((staff: { name: string, job: string }, index: number) => (<div key={index}>
                    <span className="nickname">{staff.name}</span><span className="info-value"> / {staff.job}</span>
                </div>))}
                {staffList.map((staff: { username: string, job: string }, index: number) => (<div key={index}>
                    <UserOnelineByUsername username={staff.username} /><span className="info-value"> / {staff.job}</span>
                </div>))}
                . . . and more
            </div>
        </main>
    );
}
