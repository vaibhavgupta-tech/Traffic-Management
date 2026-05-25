# 4. Live Packet Inspection Logs View (frontend/src/pages/PacketLogsView.tsx)

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


  const fetchLogs = () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '15',
      protocol: protocolFilter,
      sourceIp: searchIp
    });


    fetch(`http://localhost:5000/api/logs/query?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs);
        setTotalPages(data.pages);
      })
      .catch(err => console.error(err));
  };


  useEffect(() => {
    fetchLogs();
  }, [page, protocolFilter, searchIp]);


  // Merge runtime packet states if no filters are active
  const dynamicLogs = (!protocolFilter && !searchIp && page === 1) 
    ? [...initialPackets, ...logs].slice(0, 15)
    : logs;


  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      {/* Control Filters Area */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Target Source IP..."
            value={searchIp}
            onChange={(e) => { setSearchIp(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 w-56 font-mono"
          />
          <select
            value={protocolFilter}
            onChange={(e) => { setProtocolFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All L4 Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
            <option value="HTTP">HTTP</option>
            <option value="HTTPS">HTTPS</option>
          </select>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          Inline Packet Inspection Matrix
        </span>
      </div>


      {/* Datatable Layer */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Source IP Map</th>
              <th className="py-3 px-4">Destination IP Map</th>
              <th className="py-3 px-4">Protocol</th>
              <th className="py-3 px-4">Ports (S/D)</th>
              <th className="py-3 px-4 text-right">Length (Bytes)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 text-xs font-mono">
            {dynamicLogs.map((packet, idx) => (
              <tr key={packet._id || idx} className="hover:bg-slate-850/40 transition-colors">
                <td className="py-3 px-4 text-slate-500">{new Date(packet.timestamp).toLocaleTimeString()}</td>
                <td className="py-3 px-4 text-slate-200 font-semibold">{packet.sourceIp}</td>
                <td className="py-3 px-4 text-slate-400">{packet.destIp}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    packet.protocol === 'TCP' ? 'bg-blue-500/10 text-blue-400' :
                    packet.protocol === 'UDP' ? 'bg-amber-500/10 text-amber-400' :
                    packet.protocol === 'HTTPS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {packet.protocol}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{packet.sourcePort} ➔ {packet.destPort}</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">{packet.packetSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Structural Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 mt-4 pt-4">
        <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


🛠️ Environment Configuration & Deployment Setup
1. Environment Variable Scaffolding
Create a .env configuration file in your backend workspace directory:
Code snippet
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/dpi-dashboard?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173


2. Initialization and Setup Steps
Execute these orchestration commands in separate, active CLI processes:
Bash
