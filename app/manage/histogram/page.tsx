import ManageNavigation from "@/components/ManageNavigation";
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
import DayVisitHistogram from "@/components/DayVisitHistogram";
import WeekVisitHistogram from "@/components/WeekVisitHistogram";