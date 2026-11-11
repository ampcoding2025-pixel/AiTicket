"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, maturityLabel, type NavMaturity } from "@/config/navigation";
import { cn } from "@/lib/utils";

function MaturityBadge({ maturity }: { maturity: NavMaturity }) {
  const styles: Record<NavMaturity, string> = {
    active: "bg-emerald-100 text-emerald-800",
    mock: "bg-sky-100 text-sky-800",
    planned: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", styles[maturity])}>
      {maturityLabel[maturity]}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-fg)]">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/behzisti-logo.png"
            alt="لوگوی سازمان بهزیستی کشور"
            width={56}
            height={56}
            priority
            className="h-14 w-14 object-contain"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold leading-5 text-[var(--brand)]">
              سازمان بهزیستی کشور
            </div>
            <div className="text-[10px] tracking-wide text-[var(--muted)]">
              BEHZISTI.IR
            </div>
          </div>
        </div>
        <h1 className="mt-4 text-lg font-bold leading-7 text-slate-900">
          پلتفرم هوش تحلیلی
        </h1>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          دیده‌بان · Outside-In · تحلیل پرونده و شکایت
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.id} className="mb-5">
            <div className="mb-2 px-2 text-[11px] font-semibold text-[var(--muted)]">
              {group.label}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const disabled = item.maturity === "planned";
                return (
                  <li key={item.id}>
                    {disabled ? (
                      <div
                        className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-slate-400"
                        title="قابلیت برنامه‌ریزی‌شده"
                      >
                        <span>{item.label}</span>
                        <MaturityBadge maturity={item.maturity} />
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-[var(--brand-soft)] font-semibold text-[var(--brand)]"
                            : "text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        <span>{item.label}</span>
                        <MaturityBadge maturity={item.maturity} />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
