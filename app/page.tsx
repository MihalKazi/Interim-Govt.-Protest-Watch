import { records, categories, monthCounts, months } from "@/lib/data";
import CalendarApp from "@/components/CalendarApp";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-3rem)] min-h-0">
      <SiteHeader />

      <CalendarApp
        records={records}
        categories={categories}
        months={months}
        monthCounts={monthCounts}
      />
    </div>
  );
}
