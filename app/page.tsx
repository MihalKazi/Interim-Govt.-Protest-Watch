import { Suspense } from "react";
import { records, meta, categories, monthCounts, months } from "@/lib/data";
import Archive from "@/components/Archive";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <Hero
        scope={meta.scope}
        period={meta.period}
        total={records.length}
        months={months.length}
        categories={categories.length}
      />

      <Suspense>
        <Archive records={records} categories={categories} monthCounts={monthCounts} />
      </Suspense>
    </div>
  );
}
