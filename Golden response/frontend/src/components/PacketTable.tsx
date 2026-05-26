import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { api } from "../lib/api";
import type { PacketLog } from "../types";
import { severityClass } from "./severity";

interface PacketTableProps {
  packets: PacketLog[];
  total: number;
  page: number;
  limit: number;
  onPage: (page: number) => void;
  onDeleted: (id: string) => void;
}

export function PacketTable({ packets, total, page, limit, onPage, onDeleted }: PacketTableProps) {
  const pages = Math.max(1, Math.ceil(total / limit));

  async function deletePacket(id: string) {
    await api.delete(`/packets/${id}`);
    onDeleted(id);
  }

  return (
    <section id="live-packets" className="rounded-lg border border-line bg-panel/80">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Real-Time Packet Monitor</h2>
          <p className="text-sm text-slate-400">{total.toLocaleString()} packet logs indexed</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <button className="rounded-md border border-line px-3 py-2 hover:bg-white/5" onClick={() => onPage(Math.max(1, page - 1))}>
            Prev
          </button>
          <span>
            {page} / {pages}
          </span>
          <button className="rounded-md border border-line px-3 py-2 hover:bg-white/5" onClick={() => onPage(Math.min(pages, page + 1))}>
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Protocol</th>
              <th className="px-4 py-3">Port</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {packets.map((packet) => (
              <tr key={packet.id} className="text-slate-200 hover:bg-white/[0.025]">
                <td className="px-4 py-3 text-slate-400">{formatDistanceToNow(new Date(packet.timestamp), { addSuffix: true })}</td>
                <td className="px-4 py-3 font-mono text-cyan">{packet.sourceIp}</td>
                <td className="px-4 py-3 font-mono">{packet.destinationIp}</td>
                <td className="px-4 py-3">{packet.protocol}</td>
                <td className="px-4 py-3">{packet.port}</td>
                <td className="px-4 py-3">{packet.size.toLocaleString()} B</td>
                <td className="px-4 py-3 capitalize">{packet.packetType}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${severityClass(packet.severity)}`}>{packet.severity}</span>
                </td>
                <td className="px-4 py-3 capitalize">{packet.action}</td>
                <td className="px-4 py-3">
                  <button title="Delete log" className="rounded-md p-2 text-slate-400 hover:bg-danger/10 hover:text-danger" onClick={() => deletePacket(packet.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
