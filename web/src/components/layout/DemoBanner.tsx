"use client";

const provider = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? "mock";

/** Thin mode chip — detailed period/source lives on the page context strip only. */
export function DemoBanner() {
  if (provider === "api") {
    return (
      <div className="border-b border-[var(--border)] bg-white px-4 py-1.5 text-center text-xs text-slate-600">
        حالت داده: <span className="font-medium text-teal-800">دیده‌بان · فقط‌خواندنی</span>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--border)] bg-white px-4 py-1.5 text-center text-xs text-slate-600">
      حالت داده: <span className="font-medium text-amber-800">نمایشی (Mock)</span>
    </div>
  );
}
