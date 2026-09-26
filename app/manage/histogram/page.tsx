import ManageNavigation from "@/app/components/ManageNavigation";
export default function HistogramPage() {
    return (
        <main>
            <ManageNavigation buttonLogout={false} />
            <h2>本日</h2>
            <DayVisitHistogram />
            <h2>本周</h2>
            <WeekVisitHistogram />
        </main>
    );
}
import DayVisitHistogram from "@/app/components/DayVisitHistogram";
import WeekVisitHistogram from "@/app/components/WeekVisitHistogram";