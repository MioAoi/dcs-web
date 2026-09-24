import NavigateButton from "@/app/components/NavigateButton";
export default function HistogramPage() {
    return (
        <main>
            <h2>本日</h2>
            <DayVisitHistogram />
            <h2>本周</h2>
            <WeekVisitHistogram />
            <div className="invwindow master-width">
                <NavigateButton href="/manage" buttonText="^返回管理" buttonColor="escape" />
            </div>
        </main>
    );
}
import DayVisitHistogram from "@/app/components/DayVisitHistogram";
import WeekVisitHistogram from "@/app/components/WeekVisitHistogram";
