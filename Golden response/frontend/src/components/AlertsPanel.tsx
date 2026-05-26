import { ShieldCheck, Siren } from "lucide-react";
import type { ThreatAlert } from "../types";
import { severityClass } from "./severity";

export function AlertsPanel({ alerts, connected }: { alerts: ThreatAlert[]; connected: boolean }) {
  return (
    <section id="threat-alerts" className="rounded-lg border border-line bg-panel/80">
      <div className="flex items-center justify-between border-b border-line px-4 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">Threat Alert Summary</h2>
          <p className="text-sm text-slate-400">Detection rules and analyst queue</p>
        </div>
        <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ${connected ? "bg-acid/10 text-acid" : "bg-danger/10 text-danger"}`}>
          <ShieldCheck size={15} />
          {connected ? "Live" : "Offline"}
        </div>
      </div>
      <div className="max-h-[440px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-400">No active alerts yet.</div>
        ) : (
          alerts.map((alert) => (
            <article key={alert.id} className="border-b border-line px-4 py-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-danger/10 p-2 text-danger">
                  <Siren size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white">{alert.title}</h3>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${severityClass(alert.severity)}`}>{alert.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{alert.description}</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    {alert.sourceIp ?? "unknown"} -> {alert.destinationIp ?? "unknown"}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
