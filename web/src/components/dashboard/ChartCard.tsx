import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  flat = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  /** Lighter enclosure for secondary panels (Ch.3 declutter) */
  flat?: boolean;
}) {
  return (
    <section
      className={cn(
        "bg-white p-4",
        flat
          ? "border-t border-[var(--border)] pt-4"
          : "rounded-lg border border-[var(--border)]",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
