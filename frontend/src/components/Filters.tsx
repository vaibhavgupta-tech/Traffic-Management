import { Search } from "lucide-react";
import type { PacketFilters } from "../lib/api";

interface FiltersProps {
  filters: PacketFilters;
  onChange: (filters: PacketFilters) => void;
}

export function Filters({ filters, onChange }: FiltersProps) {
  function set(key: keyof PacketFilters, value: string) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <section className="rounded-lg border border-line bg-panel/80 p-4">
      <div className="grid gap-3 md:grid-cols-[1.5fr_repeat(5,minmax(0,1fr))]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input
            className="h-10 w-full rounded-md border border-line bg-obsidian pl-10 pr-3 text-sm text-white outline-none focus:border-cyan/60"
            placeholder="Search packet ID, IP, protocol, signature"
            value={filters.search ?? ""}
            onChange={(event) => set("search", event.target.value)}
          />
        </label>
        <input className="h-10 rounded-md border border-line bg-obsidian px-3 text-sm text-white outline-none focus:border-cyan/60" placeholder="IP address" value={filters.ip ?? ""} onChange={(event) => set("ip", event.target.value)} />
        <select className="h-10 rounded-md border border-line bg-obsidian px-3 text-sm text-white outline-none focus:border-cyan/60" value={filters.protocol ?? ""} onChange={(event) => set("protocol", event.target.value)}>
          <option value="">Protocol</option>
          {["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"].map((protocol) => (
            <option key={protocol}>{protocol}</option>
          ))}
        </select>
        <input className="h-10 rounded-md border border-line bg-obsidian px-3 text-sm text-white outline-none focus:border-cyan/60" placeholder="Port" value={filters.port ?? ""} onChange={(event) => set("port", event.target.value)} />
        <select className="h-10 rounded-md border border-line bg-obsidian px-3 text-sm text-white outline-none focus:border-cyan/60" value={filters.packetType ?? ""} onChange={(event) => set("packetType", event.target.value)}>
          <option value="">Packet type</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
          <option value="lateral">Lateral</option>
        </select>
        <select className="h-10 rounded-md border border-line bg-obsidian px-3 text-sm text-white outline-none focus:border-cyan/60" value={filters.severity ?? ""} onChange={(event) => set("severity", event.target.value)}>
          <option value="">Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </section>
  );
}
