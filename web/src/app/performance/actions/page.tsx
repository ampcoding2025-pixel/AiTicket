"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { KpiActionRegister } from "@/components/dashboard/KpiActionRegister";

function ActionsInner() {
  const search = useSearchParams();
  const finding = search.get("finding") ?? undefined;
  const kpi = search.get("kpi") ?? "D1";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">ثبت اقدام شاخص</h1>
        <p className="mt-1 text-sm text-slate-600">
          حلقهٔ یافته → اقدام → اندازه‌گیری مجدد. ذخیره محلی مرورگر؛ بدون نوشتن در دیده‌بان.
        </p>
      </div>
      <KpiActionRegister presetFinding={finding} presetKpiCode={kpi} />
    </div>
  );
}

export default function KpiActionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center text-sm text-[var(--muted)]">
          در حال بارگذاری ثبت اقدام...
        </div>
      }
    >
      <ActionsInner />
    </Suspense>
  );
}
