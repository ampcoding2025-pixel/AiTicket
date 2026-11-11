"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createKpiAction,
  loadKpiActions,
  saveKpiActions,
  type KpiAction,
  type KpiActionStatus,
} from "@/data/kpiActionStore";
import { cn, formatFaNumber } from "@/lib/utils";

const KPI_OPTIONS = [
  { code: "D1", label: "D1 — پوشش پاسخ شهروند" },
  { code: "A2", label: "A2 — حجم شکایت / تمرکز موضوع" },
  { code: "A4", label: "A4 — حجم موضوع/طبقه" },
  { code: "B2", label: "B2 — زمان رسیدگی (نیازمند قاعده)" },
  { code: "B3", label: "B3 — backlog (نیازمند قاعده)" },
  { code: "other", label: "سایر / چندشاخصی" },
];

const statusLabel: Record<KpiActionStatus, string> = {
  open: "باز",
  done: "انجام شد",
  cancelled: "لغو",
};

export function KpiActionRegister({
  presetFinding,
  presetKpiCode = "D1",
}: {
  presetFinding?: string;
  presetKpiCode?: string;
}) {
  const [actions, setActions] = useState<KpiAction[]>([]);
  const [finding, setFinding] = useState(presetFinding ?? "");
  const [kpiCode, setKpiCode] = useState(presetKpiCode);
  const [proposedAction, setProposedAction] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [expectedEffect, setExpectedEffect] = useState("");
  const [remeasureDate, setRemeasureDate] = useState("");

  useEffect(() => {
    setActions(loadKpiActions());
  }, []);

  useEffect(() => {
    if (presetFinding) setFinding(presetFinding);
  }, [presetFinding]);

  function persist(next: KpiAction[]) {
    setActions(next);
    saveKpiActions(next);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!finding.trim() || !proposedAction.trim()) return;
    const row = createKpiAction({
      finding: finding.trim(),
      kpiCode,
      proposedAction: proposedAction.trim(),
      owner: owner.trim() || "نامشخص",
      dueDate: dueDate || "—",
      expectedEffect: expectedEffect.trim() || "—",
      remeasureDate: remeasureDate || "—",
    });
    persist([row, ...actions]);
    setFinding("");
    setProposedAction("");
    setOwner("");
    setExpectedEffect("");
  }

  function setStatus(id: string, status: KpiActionStatus) {
    persist(actions.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const openCount = actions.filter((a) => a.status === "open").length;

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 text-xs leading-6 text-slate-700">
        ثبت اقدام برای بستن حلقه «یافته → اقدام → اندازه‌گیری مجدد». ذخیره فقط در مرورگر این دستگاه است
        و به دیده‌بان نوشته نمی‌شود. اعداد KPI باید از داشبورد/SQL بیایند، نه از حدس.
      </div>

      <p className="text-sm text-slate-600">
        اقدامات باز: <span className="font-semibold text-slate-900">{formatFaNumber(openCount)}</span> از{" "}
        {formatFaNumber(actions.length)}
      </p>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] bg-white p-4 md:grid-cols-2"
      >
        <label className="block text-xs md:col-span-2">
          <span className="font-medium text-slate-700">یافته (از داشبورد)</span>
          <textarea
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            rows={2}
            value={finding}
            onChange={(e) => setFinding(e.target.value)}
            placeholder="مثال: پوشش پاسخ در واحد تهران ۴٫۳٪ با حجم بالا"
            required
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-slate-700">شاخص هدف</span>
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={kpiCode}
            onChange={(e) => setKpiCode(e.target.value)}
          >
            {KPI_OPTIONS.map((o) => (
              <option key={o.code} value={o.code}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-medium text-slate-700">مسئول پیگیری</span>
          <input
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="نام واحد / فرد"
          />
        </label>
        <label className="block text-xs md:col-span-2">
          <span className="font-medium text-slate-700">اقدام پیشنهادی</span>
          <textarea
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            rows={2}
            value={proposedAction}
            onChange={(e) => setProposedAction(e.target.value)}
            placeholder="مثال: پایلوت ثبت ReplyCitizen برای ۳ موضوع پرتکرار در واحد تهران"
            required
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-slate-700">سررسید اقدام</span>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-slate-700">تاریخ اندازه‌گیری مجدد KPI</span>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={remeasureDate}
            onChange={(e) => setRemeasureDate(e.target.value)}
          />
        </label>
        <label className="block text-xs md:col-span-2">
          <span className="font-medium text-slate-700">اثر مورد انتظار روی KPI</span>
          <input
            className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={expectedEffect}
            onChange={(e) => setExpectedEffect(e.target.value)}
            placeholder="مثال: افزایش ۱–۲ واحد درصدی پوشش در ۹۰ روز — بدون ادعای Validity"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            ثبت اقدام
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th className="px-3 py-2 font-medium">وضعیت</th>
              <th className="px-3 py-2 font-medium">KPI</th>
              <th className="px-3 py-2 font-medium">یافته</th>
              <th className="px-3 py-2 font-medium">اقدام</th>
              <th className="px-3 py-2 font-medium">مسئول</th>
              <th className="px-3 py-2 font-medium">سررسید</th>
              <th className="px-3 py-2 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {actions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  هنوز اقدامی ثبت نشده — از تشخیص پوشش یک یافته بردارید و اینجا ثبت کنید.
                </td>
              </tr>
            ) : (
              actions.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 align-top">
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-medium",
                        a.status === "open" && "bg-amber-50 text-amber-900",
                        a.status === "done" && "bg-slate-100 text-slate-700",
                        a.status === "cancelled" && "bg-slate-50 text-slate-500",
                      )}
                    >
                      {statusLabel[a.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-800">{a.kpiCode}</td>
                  <td className="px-3 py-2 text-xs text-slate-700">{a.finding}</td>
                  <td className="px-3 py-2 text-xs text-slate-700">
                    {a.proposedAction}
                    {a.expectedEffect !== "—" ? (
                      <div className="mt-1 text-slate-500">اثر: {a.expectedEffect}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-xs">{a.owner}</td>
                  <td className="px-3 py-2 text-xs">
                    {a.dueDate}
                    <div className="text-slate-400">اندازه‌گیری: {a.remeasureDate}</div>
                  </td>
                  <td className="px-3 py-2">
                    {a.status === "open" ? (
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="text-xs text-teal-800 underline-offset-2 hover:underline"
                          onClick={() => setStatus(a.id, "done")}
                        >
                          انجام شد
                        </button>
                        <button
                          type="button"
                          className="text-xs text-slate-500 underline-offset-2 hover:underline"
                          onClick={() => setStatus(a.id, "cancelled")}
                        >
                          لغو
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-slate-500 underline-offset-2 hover:underline"
                        onClick={() => setStatus(a.id, "open")}
                      >
                        بازگشایی
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
