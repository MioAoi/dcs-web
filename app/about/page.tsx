import PlayerNavigation from '@/components/PlayerNavigation'
import UserOnelineByUsername from '@/components/UserOnelineByUsername'

export default function AboutPage() {
    const explicitStaffList = [
        { name: '澪碧衣', job: 'Housekeeper' }
    ]
    const staffList = [
        { username: 'L0SERr', job: 'Hardwareist' }
    ];

    return (
        <main>
            <PlayerNavigation buttonLogout={false}  />
            <h2>关于我们</h2>
            <div className="windowlike master-width">
                {explicitStaffList.map((staff, index) => (<div key={index}>
                    <span className="nickname">{staff.name}</span><span className="info-value"> / {staff.job}</span>
                </div>))}
                {staffList.map((staff, index) => (<div key={index}>
                    <UserOnelineByUsername username={staff.username} /><span className="info-value"> / {staff.job}</span>
                </div>))}
                . . . and more
            </div>
        </main>
    );
}
