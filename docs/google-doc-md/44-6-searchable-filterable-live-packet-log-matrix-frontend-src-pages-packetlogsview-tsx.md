# 6. Searchable & Filterable Live Packet Log Matrix (frontend/src/pages/PacketLogsView.tsx)

TypeScript
import React, { useState, useEffect } from 'react';


interface LogsViewProps {
  initialPackets: any[];
}


export default function PacketLogsView({ initialPackets }: LogsViewProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [protocolFilter, setProtocolFilter] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const executeLogFetch = () => {
    const filters = new URLSearchParams({
      page: page.toString(),
      limit: '14',
      protocol: protocolFilter,
      sourceIp: searchIp
    });


    fetch(`http://localhost:5000/api/logs/query?${filters.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs);
        setTotalPages(data.pages);
      })
      .catch(err => console.error('[CRITICAL DB API EXCEPTION]:', err));
  };


  useEffect(() => {
    executeLogFetch();
  }, [page, protocolFilter, searchIp]);


  // Dynamically blend live reactive memory states with base database arrays
  const runtimeViewLogs = (!protocolFilter && !searchIp && page === 1) 
    ? [...initialPackets, ...logs].slice(0, 14)
    : logs;


  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      
      {/* Operations Filters Grid Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search Host IP Source (e.g. 192.168.1...)"
            value={searchIp}
            onChange={(e) => { setSearchIp(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/80 w-64 font-mono tracking-wide"
          />
          <select
            value={protocolFilter}
            onChange={(e) => { setProtocolFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/80 font-mono"
          >
            <option value="">Filter By Protocol (All)</option>
            <option value="TCP">Protocol Layer: TCP</option>
            <option value="UDP">Protocol Layer: UDP</option>
            <option value="ICMP">Protocol Layer: ICMP</option>
            <option value="HTTP">Protocol Layer: HTTP</option>
            <option value="HTTPS">Protocol Layer: HTTPS</option>
          </select>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20 uppercase tracking-widest font-bold">
          Deep Inspection Operational Matrix
        </span>
      </div>


      {/* High Volume Low Latency Tabular Grid */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/60 bg-slate-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
              <th className="py-3.5 px-4">Intercept Time</th>
              <th className="py-3.5 px-4">Ingress IP Address</th>
              <th className="py-3.5 px-4">Egress Destination</th>
              <th className="py-3.5 px-4">Protocol L4</th>
              <th className="py-3.5 px-4">Port Sequence (S/D)</th>
              <th className="py-3.5 px-4 text-right">Size Metric</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/50 text-xs font-mono">
            {runtimeViewLogs.map((packet, idx) => (
              <tr key={packet._id || idx} className="hover:bg-slate-800/30 transition-all duration-150 group">
                <td className="py-3 px-4 text-slate-500 group-hover:text-slate-400">{new Date(packet.timestamp).toLocaleTimeString()}</td>
                <td className="py-3 px-4 text-slate-200 font-bold group-hover:text-emerald-400 transition-colors">{packet.sourceIp}</td>
                <td className="py-3 px-4 text-slate-400">{packet.destIp}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    packet.protocol === 'TCP' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    packet.protocol === 'UDP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    packet.protocol === 'HTTPS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    'bg-slate-800/80 text-slate-400'
                  }`}>
                    {packet.protocol}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{packet.sourcePort} <span className="text-slate-600">➔</span> {packet.destPort}</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-semibold">{packet.packetSize} <span className="text-[10px] text-slate-500 font-normal">B</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Structural Pagination Layout Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 mt-5 pt-4">
        <span className="text-xs text-slate-500 font-mono">Session View Offset Index: Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-3.5 py-1.5 bg-slate-800/80 border border-slate-700/60 text-xs font-mono font-medium text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            &lt; Previous_Block
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="px-3.5 py-1.5 bg-slate-800/80 border border-slate-700/60 text-xs font-mono font-medium text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next_Block &gt;
          </button>
        </div>
      </div>
    </div>
  );
}


