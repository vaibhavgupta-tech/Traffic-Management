# client\src\components\MetricCard.tsx



``tsx
import { LucideIcon } from "lucide-react";


interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "cyan" | "green" | "yellow" | "red";
}


const tones = {
  cyan: "text-cyan bg-cyan/10",
  green: "text-signal bg-signal/10",
  yellow: "text-warn bg-warn/10",
  red: "text-danger bg-danger/10"
};


export function MetricCard({ icon: Icon, label, value, tone }: Props) {
  return (
    <section className="rounded border border-line bg-panel p-4 shadow-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </section>
  );
}


client\src\components\PacketTable.tsx
``tsx
import { Packet } from "../types/network";
interface Props {
packets: Packet[];
page: number;
pages: number;
onPage: (page: number) => void;
}
export function PacketTable({ packets, page, pages, onPage }: Props) {
return (
<section className="rounded border border-line bg-panel">
<div className="flex items-center justify-between border-b border-line px-4 py-3">
<h2 className="text-sm font-semibold text-slate-100">Real-time packet stream</h2>
<span className="rounded bg-cyan/10 px-2 py-1 text-xs text-cyan">Live</span>
</div>
<div className="overflow-x-auto">
<table className="min-w-full text-left text-sm">
<thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
<tr>
<th className="px-4 py-3">Source</th>
<th className="px-4 py-3">Destination</th>
<th className="px-4 py-3">Protocol</th>
<th className="px-4 py-3">Port</th>
<th className="px-4 py-3">Size</th>
<th className="px-4 py-3">Type</th>
<th className="px-4 py-3">Timestamp</th>
</tr>
</thead>
<tbody className="divide-y divide-line">
{packets.map((packet) => (
<tr key={packet._id} className="text-slate-300 hover:bg-white/[0.03]">
<td className="px-4 py-3 font-mono text-cyan">{packet.sourceIp}</td>
<td className="px-4 py-3 font-mono">{packet.destinationIp}</td>
<td className="px-4 py-3">{packet.protocol}</td>
<td className="px-4 py-3">{packet.port}</td>
<td className="px-4 py-3">{packet.size} B</td>
<td className="px-4 py-3 capitalize">{packet.packetType}</td>
<td className="px-4 py-3 text-slate-400">{new Date(packet.timestamp).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
<div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-slate-400">
<button className="btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
<span>Page {page} of {pages}</span>
<button className="btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
</div>
</section>
);
}


