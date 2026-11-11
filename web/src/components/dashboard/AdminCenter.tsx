"use client";

import { useEffect, useState } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { getAnalyticsProvider } from "@/data/providers";
import type { AdminCenterData } from "@/data/providers/types";
import { cn } from "@/lib/utils";

export type AdminSection = "users" | "sources" | "integration" | "audit" | "settings";

const roleLabel: Record<AdminCenterData["users"][number]["role"], string> = {
  executive: "مدیر ارشد",
  analytics: "مدیر تحلیل",
  supervisor: "سرپرست",
  expert: "کارشناس",
  admin: "راهبر",
};

const sourceStatusLabel = {
  connected_stub: "متصل (Stub)",
  unreachable_stub: "غیرقابل دسترس",
  not_configured: "پیکربندی‌نشده",
} as const;

const integrationStatusLabel = {
  ok_stub: "سالم",
  warn_stub: "هشدار",
  fail_stub: "ناموفق",
  pending: "در انتظار",
} as const;

const integrationStyle = {
  ok_stub: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warn_stub: "bg-amber-50 text-amber-900 border-amber-200",
  fail_stub: "bg-rose-50 text-rose-800 border-rose-200",
  pending: "bg-slate-100 text-slate-600 border-slate-200",
} as const;

export function AdminCenter({ section }: { section: AdminSection }) {
  const [data, setData] = useState<AdminCenterData | null>(null);

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getAdminCenter()
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری پوسته مدیریت...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
        <div className="font-semibold">{data.meta.label}</div>
        <p className="mt-1 text-xs leading-5 text-slate-600">{data.meta.note}</p>
      </div>

      {section === "users" ? (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ChartCard title="کاربران" subtitle="نمونه نقش‌محور">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                      <th className="py-2 font-medium">نام</th>
                      <th className="py-2 font-medium">نقش</th>
                      <th className="py-2 font-medium">واحد</th>
                      <th className="py-2 font-medium">وضعیت</th>
                      <th className="py-2 font-medium">آخرین ورود</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50">
                        <td className="py-2.5 font-medium">{u.name}</td>
                        <td className="py-2.5">{roleLabel[u.role]}</td>
                        <td className="py-2.5 text-xs text-slate-500">{u.unit}</td>
                        <td className="py-2.5">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px]",
                              u.status === "active"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-slate-100 text-slate-500",
                            )}
                          >
                            {u.status === "active" ? "فعال" : "غیرفعال"}
                          </span>
                        </td>
                        <td className="py-2.5 text-xs text-slate-500">{u.lastLoginLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
          <div className="xl:col-span-2">
            <ChartCard title="نقش‌ها و مجوزها" subtitle="نگاشت اولیه IA">
              <ul className="space-y-3">
                {data.roles.map((r) => (
                  <li key={r.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="text-sm font-semibold text-slate-900">{r.label}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.permissions.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-400"
                disabled
              >
                افزودن کاربر (غیرفعال — فاز Identity)
              </button>
            </ChartCard>
          </div>
        </section>
      ) : null}

      {section === "sources" ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.dataSources.map((ds) => (
            <ChartCard key={ds.id} title={ds.name} subtitle={`${ds.engine} · ${ds.database}`}>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--muted)]">حالت دسترسی: </span>
                  {ds.accessMode === "read_only"
                    ? "فقط‌خواندنی"
                    : ds.accessMode === "denied"
                      ? "denied"
                      : "نامشخص"}
                </div>
                <div>
                  <span
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px] font-medium",
                      ds.status === "connected_stub"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : ds.status === "unreachable_stub"
                          ? "border-rose-200 bg-rose-50 text-rose-800"
                          : "border-slate-200 bg-slate-100 text-slate-600",
                    )}
                  >
                    {sourceStatusLabel[ds.status]}
                  </span>
                </div>
                <p className="text-xs leading-6 text-slate-500">{ds.note}</p>
              </div>
            </ChartCard>
          ))}
        </section>
      ) : null}

      {section === "integration" ? (
        <ChartCard title="پایش یکپارچه‌سازی" subtitle="سلامت اتصالات و جاب‌ها">
          <ul className="space-y-3">
            {data.integrations.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{item.detail}</p>
                  <div className="mt-1 text-[11px] text-slate-400">{item.checkedAt}</div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium",
                    integrationStyle[item.status],
                  )}
                >
                  {integrationStatusLabel[item.status]}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {section === "audit" ? (
        <ChartCard title="لاگ ممیزی" subtitle="رویدادهای نمایشی — ذخیره پایدار ندارد">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                  <th className="py-2 font-medium">زمان</th>
                  <th className="py-2 font-medium">عامل</th>
                  <th className="py-2 font-medium">اقدام</th>
                  <th className="py-2 font-medium">هدف</th>
                  <th className="py-2 font-medium">نتیجه</th>
                </tr>
              </thead>
              <tbody>
                {data.auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50">
                    <td className="py-2.5 text-xs text-slate-500">{log.time}</td>
                    <td className="py-2.5">{log.actor}</td>
                    <td className="py-2.5">{log.action}</td>
                    <td className="py-2.5 text-xs text-slate-500">{log.target}</td>
                    <td className="py-2.5">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[11px]",
                          log.result === "success"
                            ? "bg-emerald-50 text-emerald-800"
                            : log.result === "denied"
                              ? "bg-amber-50 text-amber-900"
                              : "bg-rose-50 text-rose-800",
                        )}
                      >
                        {log.result === "success"
                          ? "موفق"
                          : log.result === "denied"
                            ? "رد دسترسی"
                            : "خطا"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      ) : null}

      {section === "settings" ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="تنظیمات سامانه" subtitle="فقط نمایش — ذخیره نمی‌شود">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-[var(--muted)]">زبان رابط</dt>
                <dd className="font-medium">{data.settings.uiLanguage}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-[var(--muted)]">پوسته پیش‌فرض</dt>
                <dd className="font-medium">{data.settings.defaultTheme}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-[var(--muted)]">Data Provider</dt>
                <dd className="font-mono text-xs">{data.settings.dataProvider}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-[var(--muted)]">ماسک PII</dt>
                <dd className="font-medium">{data.settings.piiMasking ? "فعال" : "خاموش"}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-[var(--muted)]">بنر Mock</dt>
                <dd className="font-medium">{data.settings.mockBanner ? "فعال" : "خاموش"}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled
              className="mt-4 rounded-md bg-slate-200 px-3 py-2 text-sm text-slate-500"
            >
              ذخیره تنظیمات (غیرفعال)
            </button>
          </ChartCard>
          <ChartCard title="یادداشت‌های معماری" subtitle="قواعد غیرقابل تخطی M1">
            <ul className="space-y-2 text-sm leading-7 text-slate-700">
              {data.settings.notes.map((n) => (
                <li key={n} className="rounded-lg border border-slate-100 px-3 py-2">
                  {n}
                </li>
              ))}
            </ul>
          </ChartCard>
        </section>
      ) : null}
    </div>
  );
}
