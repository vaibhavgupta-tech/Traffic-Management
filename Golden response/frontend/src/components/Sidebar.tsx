import { Activity, Database, FileDown, LayoutDashboard, RadioTower, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { exportUrl } from "../lib/api";

export function Sidebar() {
  const items: Array<[LucideIcon, string]> = [
    [LayoutDashboard, "Dashboard"],
    [RadioTower, "Live Packets"],
    [ShieldAlert, "Threat Alerts"],
    [Database, "Log Vault"],
    [Activity, "Analytics"]
  ];

  return (
    <aside className="hidden min-h-screen w-64 border-r border-line bg-obsidian/95 px-5 py-6 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
          <ShieldAlert size={21} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">SentinelDPI</h1>
          <p className="text-xs text-slate-400">SOC packet intelligence</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {items.map(([Icon, label]) => (
          <a key={label} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" href={`#${label.toLowerCase().replaceAll(" ", "-")}`}>
            <Icon size={17} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-8 rounded-lg border border-line bg-panel/60 p-4">
        <p className="text-sm font-medium text-white">Report exports</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a className="flex items-center justify-center gap-2 rounded-md bg-cyan/15 px-3 py-2 text-xs font-medium text-cyan hover:bg-cyan/25" href={exportUrl("csv")}>
            <FileDown size={14} /> CSV
          </a>
          <a className="flex items-center justify-center gap-2 rounded-md bg-acid/15 px-3 py-2 text-xs font-medium text-acid hover:bg-acid/25" href={exportUrl("json")}>
            <FileDown size={14} /> JSON
          </a>
        </div>
      </div>
    </aside>
  );
}
