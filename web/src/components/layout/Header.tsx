"use client";

import { CalendarRange, Building2, Filter, Download } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-white/90 px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">داشبورد مدیریتی</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            نمای سازمانی درخواست‌ها، شکایات، عملکرد و پوشش دانش تاریخی
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <CalendarRange className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="30d" aria-label="بازه زمانی">
              <option value="30d">۳۰ روز اخیر</option>
              <option value="90d">۹۰ روز اخیر</option>
              <option value="ytd">از ابتدای سال</option>
              <option value="all">کل دوره تاریخی</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <Building2 className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="all" aria-label="واحد سازمانی">
              <option value="all">همه واحدها</option>
              <option value="tehran-w">غرب تهران</option>
              <option value="tehran-e">شرق تهران</option>
              <option value="isfahan">اصفهان</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="all" aria-label="نوع درخواست">
              <option value="all">همه انواع</option>
              <option value="complaint">شکایت</option>
              <option value="request">درخواست</option>
            </select>
          </label>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
          >
            <Download className="h-4 w-4" />
            خروجی گزارش
          </button>
        </div>
      </div>
    </header>
  );
}
