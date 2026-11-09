export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
