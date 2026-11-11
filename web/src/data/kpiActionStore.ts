/** Browser-local action register — does not write to Didban. */

export type KpiActionStatus = "open" | "done" | "cancelled";

export type KpiAction = {
  id: string;
  createdAt: string;
  finding: string;
  kpiCode: string;
  proposedAction: string;
  owner: string;
  dueDate: string;
  expectedEffect: string;
  status: KpiActionStatus;
  remeasureDate: string;
};

const STORAGE_KEY = "aiticket.kpi-actions.v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadKpiActions(): KpiAction[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as KpiAction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveKpiActions(actions: KpiAction[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
}

export function createKpiAction(
  input: Omit<KpiAction, "id" | "createdAt" | "status"> & { status?: KpiActionStatus },
): KpiAction {
  return {
    ...input,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: input.status ?? "open",
  };
}
