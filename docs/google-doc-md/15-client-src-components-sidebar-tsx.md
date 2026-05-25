# client\src\components\Sidebar.tsx



``tsx
import { Activity, Bell, Database, Gauge, Network, ShieldAlert } from "lucide-react";


const nav = [
  { icon: Gauge, label: "Overview" },
  { icon: Activity, label: "Packets" },
  { icon: ShieldAlert, label: "Threats" },
  { icon: Database, label: "Logs" },
  { icon: Bell, label: "Reports" }
];


export function Sidebar() {
  return (
    <aside className="hidden border-r border-line bg-ink/95 px-4 py-5 lg:block lg:w-64">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded bg-cyan/15 text-cyan">
          <Network size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-cyan">DPI Sentinel</div>
          <div className="text-xs text-slate-400">SOC Traffic Console</div>
        </div>
      </div>
      <nav className="space-y-1">
        {nav.map((item, index) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm transition ${index === 0 ? "bg-cyan/10 text-cyan" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}


client\src\components\ThreatPanel.tsx
``tsx
import { ShieldAlert } from "lucide-react";
import { ThreatAlert } from "../types/network";
const severity = {
low: "text-signal",
medium: "text-warn",
high: "text-danger",
critical: "text-rose-300"
};
export function ThreatPanel({ alerts }: { alerts: ThreatAlert[] }) {
return (
<section className="rounded border border-line bg-panel">
<div className="flex items-center gap-2 border-b border-line px-4 py-3">
<ShieldAlert size={17} className="text-danger" />
<h2 className="text-sm font-semibold text-slate-100">Threat alert summary</h2>
</div>
<div className="divide-y divide-line">
{alerts.length === 0 && <div className="px-4 py-6 text-sm text-slate-500">No alerts detected.</div>}
{alerts.map((alert) => (
<article key={alert._id} className="px-4 py-3">
<div className="flex items-center justify-between gap-3">
<h3 className="text-sm font-medium text-slate-100">{alert.type}</h3>
<span className={text-xs font-semibold uppercase ${severity[alert.severity]}}>{alert.severity}</span>
</div>
<p className="mt-1 text-xs text-slate-400">{alert.description}</p>
<p className="mt-2 font-mono text-xs text-cyan">{alert.sourceIp}</p>
</article>
))}
</div>
</section>
);
}


