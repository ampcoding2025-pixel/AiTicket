import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)]">
      <DemoBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
