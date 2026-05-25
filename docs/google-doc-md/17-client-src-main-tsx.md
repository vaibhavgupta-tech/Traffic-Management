# client\src\main.tsx



``tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Dashboard } from "./pages/Dashboard";
import "./styles.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);


client\src\pages\Dashboard.tsx
``tsx
import { Activity, AlertTriangle, Database, Download, Trash2, Wifi } from "lucide-react";
import { Charts } from "../components/Charts";
import { Filters } from "../components/Filters";
import { MetricCard } from "../components/MetricCard";
import { PacketTable } from "../components/PacketTable";
import { Sidebar } from "../components/Sidebar";
import { ThreatPanel } from "../components/ThreatPanel";
import { api, cleanParams } from "../lib/api";
import { usePackets } from "../hooks/usePackets";
export function Dashboard() {
const { packets, alerts, dashboard, filters, setFilters, page, setPage, pages, loading, refetch } = usePackets();
const totalBytes = dashboard?.topIps.reduce((sum, ip) => sum + ip.bytes, 0) ?? 0;
const exportLogs = (format: "csv" | "json") => {
const params = new URLSearchParams({ ...cleanParams(filters, 1, 5000), format });
window.location.href = ${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/api/packets/export?${params.toString()};
};
const deleteLogs = async () => {
await api.delete("/packets", { params: cleanParams(filters, 1) });
await refetch();
};
return (
<div className="min-h-screen bg-ink text-slate-100">
<div className="flex min-h-screen">
<Sidebar />
<main className="flex-1 overflow-hidden">
<header className="border-b border-line bg-ink/90 px-4 py-4 md:px-6">
<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
<div>
<h1 className="text-xl font-semibold text-slate-50">Deep Packet Inspection Dashboard</h1>
<p className="text-sm text-slate-400">Real-time traffic visibility, anomaly detection, and secure log management.</p>
</div>
<div className="flex gap-2">
<button className="btn" onClick={() => exportLogs("csv")} title="Export CSV"><Download size={16} /> CSV</button>
<button className="btn" onClick={() => exportLogs("json")} title="Export JSON"><Download size={16} /> JSON</button>
<button className="btn border-danger/40 text-danger" onClick={deleteLogs} title="Delete filtered logs"><Trash2 size={16} /> Delete</button>
</div>
</div>
</header>
<div className="space-y-4 p-4 md:p-6">
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
<MetricCard icon={Database} label="Packets captured" value={(dashboard?.totalPackets ?? 0).toLocaleString()} tone="cyan" />
<MetricCard icon={AlertTriangle} label="Open threats" value={(dashboard?.openAlerts ?? 0).toLocaleString()} tone="red" />
<MetricCard icon={Wifi} label="Active sources" value={(dashboard?.topIps.length ?? 0).toString()} tone="green" />
<MetricCard icon={Activity} label="Observed volume" value={${Math.round(totalBytes / 1024)} KB} tone="yellow" />
</div>
<Filters filters={filters} onChange={(next) => { setPage(1); setFilters(next); }} />
<Charts dashboard={dashboard} />
<div className="grid gap-4 xl:grid-cols-3">
<div className="xl:col-span-2">
{loading ? <div className="rounded border border-line bg-panel p-8 text-center text-slate-400">Loading packets...</div> : <PacketTable packets={packets} page={page} pages={pages} onPage={setPage} />}
</div>
<ThreatPanel alerts={alerts} />
</div>
</div>
</main>
</div>
</div>
);
}


