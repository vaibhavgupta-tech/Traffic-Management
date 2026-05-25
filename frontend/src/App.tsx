import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Ban, Database, RadioTower, ShieldAlert } from "lucide-react";
import { AlertsPanel } from "./components/AlertsPanel";
import { Charts } from "./components/Charts";
import { Filters } from "./components/Filters";
import { MetricCard } from "./components/MetricCard";
import { PacketTable } from "./components/PacketTable";
import { Sidebar } from "./components/Sidebar";
import { fetchAlerts, fetchAnalytics, fetchPackets, type PacketFilters } from "./lib/api";
import { useSocket } from "./hooks/useSocket";
import type { DashboardAnalytics, PacketLog, ThreatAlert } from "./types";

const emptyAnalytics: DashboardAnalytics = {
  totals: { packets: 0, bytes: 0, alerts: 0, blocked: 0, flagged: 0 },
  protocolStats: [],
  severityStats: [],
  trafficTimeline: [],
  topIps: [],
  alerts: []
};

export default function App() {
  const [filters, setFilters] = useState<PacketFilters>({ page: 1, limit: 25 });
  const [packets, setPackets] = useState<PacketLog[]>([]);
  const [total, setTotal] = useState(0);
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(emptyAnalytics);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [packetResponse, analyticsResponse, alertResponse] = await Promise.all([fetchPackets(filters), fetchAnalytics(), fetchAlerts()]);
    setPackets(packetResponse.data);
    setTotal(packetResponse.total);
    setAnalytics(analyticsResponse);
    setAlerts(alertResponse);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, [refresh]);

  const handlePacket = useCallback((packet: PacketLog) => {
    setPackets((current) => [packet, ...current].slice(0, 25));
    setTotal((value) => value + 1);
  }, []);

  const handleAlert = useCallback((alert: ThreatAlert) => {
    setAlerts((current) => [alert, ...current].slice(0, 50));
  }, []);

  const connected = useSocket(handlePacket, handleAlert);

  useEffect(() => {
    const timer = window.setInterval(() => {
      fetchAnalytics().then(setAnalytics).catch(() => undefined);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const byteLabel = useMemo(() => {
    if (analytics.totals.bytes > 1_000_000) return `${(analytics.totals.bytes / 1_000_000).toFixed(2)} MB`;
    return `${(analytics.totals.bytes / 1000).toFixed(1)} KB`;
  }, [analytics.totals.bytes]);

  return (
    <div className="min-h-screen bg-obsidian text-slate-100">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <header className="border-b border-line bg-obsidian/90 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan">Deep packet inspection</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Network Traffic Command Center</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-400">
                  Monitor live packets, detect suspicious traffic patterns, filter forensic logs, and export evidence-ready reports.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3">
                <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-acid" : "bg-danger"}`} />
                <span className="text-sm text-slate-300">Socket.io stream {connected ? "connected" : "reconnecting"}</span>
              </div>
            </div>
          </header>

          <div id="dashboard" className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Packets Captured" value={analytics.totals.packets.toLocaleString()} detail="Indexed in active analysis window" icon={RadioTower} tone="cyan" />
              <MetricCard label="Traffic Volume" value={byteLabel} detail="Aggregated packet payload size" icon={Activity} tone="green" />
              <MetricCard label="Threat Alerts" value={alerts.length.toLocaleString()} detail="Open detections awaiting review" icon={ShieldAlert} tone="red" />
              <MetricCard label="Blocked Logs" value={analytics.totals.blocked.toLocaleString()} detail="Policy-blocked network events" icon={Ban} tone="amber" />
              <MetricCard label="Flagged Packets" value={analytics.totals.flagged.toLocaleString()} detail="DPI matches requiring triage" icon={Database} tone="red" />
            </div>

            <div className="grid gap-5 2xl:grid-cols-[1fr_420px]">
              <div className="space-y-5">
                <Filters filters={filters} onChange={setFilters} />
                {loading ? (
                  <section className="rounded-lg border border-line bg-panel/80 p-10 text-center text-slate-400">Loading packet intelligence...</section>
                ) : (
                  <PacketTable
                    packets={packets}
                    total={total}
                    page={filters.page ?? 1}
                    limit={filters.limit ?? 25}
                    onPage={(page) => setFilters((current) => ({ ...current, page }))}
                    onDeleted={(id) => {
                      setPackets((current) => current.filter((packet) => packet.id !== id));
                      setTotal((value) => Math.max(0, value - 1));
                    }}
                  />
                )}
              </div>
              <AlertsPanel alerts={alerts} connected={connected} />
            </div>

            <Charts analytics={analytics} />
          </div>
        </main>
      </div>
    </div>
  );
}
