# client\src\components\Charts.tsx



``tsx
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardData } from "../types/network";


const colors = ["#20d6c7", "#a3e635", "#facc15", "#fb7185", "#60a5fa", "#c084fc"];


export function Charts({ dashboard }: { dashboard: DashboardData | null }) {
  const protocolData = dashboard?.protocolStats.map((item) => ({ name: item._id, value: item.value })) ?? [];
  const timeline = dashboard?.timeline.map((item) => ({ time: item._id, packets: item.packets, kb: Math.round(item.bytes / 1024) })) ?? [];


  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <section className="rounded border border-line bg-panel p-4 xl:col-span-3">
        <h2 className="mb-4 text-sm font-semibold text-slate-100">Packet activity timeline</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="traffic" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20d6c7" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#20d6c7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#20303a" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#101a20", border: "1px solid #20303a", borderRadius: 4 }} />
              <Area type="monotone" dataKey="packets" stroke="#20d6c7" fill="url(#traffic)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded border border-line bg-panel p-4 xl:col-span-2">
        <h2 className="mb-4 text-sm font-semibold text-slate-100">Protocol usage</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={protocolData}>
              <CartesianGrid stroke="#20303a" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#101a20", border: "1px solid #20303a", borderRadius: 4 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {protocolData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}


client\src\components\Filters.tsx
``tsx
import { Search, SlidersHorizontal } from "lucide-react";
import { PacketFilters } from "../types/network";
interface Props {
filters: PacketFilters;
onChange: (filters: PacketFilters) => void;
}
export function Filters({ filters, onChange }: Props) {
const update = (key: keyof PacketFilters, value: string) => onChange({ ...filters, [key]: value });
return (
<section className="rounded border border-line bg-panel p-4">
<div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
<SlidersHorizontal size={16} className="text-cyan" />
Traffic filters
</div>
<div className="grid gap-3 md:grid-cols-3 xl:grid-cols-8">
<label className="relative md:col-span-2">
<Search className="absolute left-3 top-3 text-slate-500" size={16} />
<input className="input pl-9" placeholder="Search IP or protocol" value={filters.search} onChange={(event) => update("search", event.target.value)} />
</label>
<input className="input" placeholder="Source IP" value={filters.sourceIp} onChange={(event) => update("sourceIp", event.target.value)} />
<input className="input" placeholder="Destination IP" value={filters.destinationIp} onChange={(event) => update("destinationIp", event.target.value)} />
<select className="input" value={filters.protocol} onChange={(event) => update("protocol", event.target.value)}>
<option value="">All protocols</option>
{["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "OTHER"].map((item) => <option key={item}>{item}</option>)}
</select>
<input className="input" placeholder="Port" value={filters.port} onChange={(event) => update("port", event.target.value)} />
<select className="input" value={filters.packetType} onChange={(event) => update("packetType", event.target.value)}>
<option value="">All directions</option>
<option value="inbound">Inbound</option>
<option value="outbound">Outbound</option>
<option value="internal">Internal</option>
</select>
<input className="input" type="datetime-local" value={filters.from} onChange={(event) => update("from", event.target.value)} />
<input className="input" type="datetime-local" value={filters.to} onChange={(event) => update("to", event.target.value)} />
</div>
</section>
);
}


