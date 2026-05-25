# 5. High-Impact Operations Dashboard Component (frontend/src/pages/DashboardOverview.tsx)

TypeScript
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Activity, ShieldAlert, Cpu } from 'lucide-react';


interface OverviewProps {
  livePackets: any[];
  alerts: any[];
}


export default function DashboardOverview({ livePackets, alerts }: OverviewProps) {
  const [stats, setStats] = useState<any>({ totalPackets: 0, protocolStats: [], topIps: [] });


  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/overview')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('[DATA INTEGRITY FAULT]:', err));
  }, [livePackets]);


  const STYLED_PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];


  return (
    <div className="space-y-6">
      
      {/* Macro Analytics Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 flex justify-between items-center backdrop-blur-sm">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Processed Load Count</p>
            <h3 className="text-2xl font-mono font-bold text-slate-100 mt-1">{stats.totalPackets + livePackets.length}</h3>
          </div>
          <Activity className="w-8 h-8 text-emerald-400 bg-emerald-500/10 p-2 rounded-lg" />
        </div>
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 flex justify-between items-center backdrop-blur-sm">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Unresolved Threats</p>
            <h3 className="text-2xl font-mono font-bold text-rose-400 mt-1">{alerts.length}</h3>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-400 bg-rose-500/10 p-2 rounded-lg" />
        </div>
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 flex justify-between items-center backdrop-blur-sm">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ingress Bandwidth</p>
            <h3 className="text-2xl font-mono font-bold text-blue-400 mt-1">~1.33 p/s</h3>
          </div>
          <Cpu className="w-8 h-8 text-blue-400 bg-blue-500/10 p-2 rounded-lg" />
        </div>
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 flex justify-between items-center backdrop-blur-sm">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Unique Core IPs</p>
            <h3 className="text-2xl font-mono font-bold text-amber-400 mt-1">{stats.topIps?.length || 0}</h3>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-400 bg-amber-500/10 p-2 rounded-lg" />
        </div>
      </div>


      {/* Advanced Recharts Interactive Rendering Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Protocol Histogram distribution chart */}
        <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 shadow-inner">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">L4/L7 Distribution Matrix</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.protocolStats}>
                <XAxis dataKey="protocol" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} />
                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {stats.protocolStats?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STYLED_PALETTE[index % STYLED_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Top Attacking Network IPs Distribution */}
        <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 shadow-inner">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Top Ingress Contributors</h4>
          <div className="h-64 flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.topIps} dataKey="count" nameKey="ip" cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4}>
                    {stats.topIps?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={STYLED_PALETTE[index % STYLET_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              {stats.topIps?.map((item: any, index: number) => (
                <div key={item.ip} className="flex items-center justify-between sm:justify-start gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STYLED_PALETTE[index % STYLED_PALETTE.length] }} />
                    <span className="text-slate-400 truncate w-32">{item.ip}</span>
                  </div>
                  <span className="font-bold text-slate-200">[{item.count} pkts]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Real-time Stateful Intrusion Events Stream */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Intrusion Detection System Security Log Stream</h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-slate-500 tracking-wider">
              🟢 Zero anomalous system indicators match structural signature maps.
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`flex items-start justify-between p-3.5 rounded-lg bg-slate-950/80 border-l-4 border-y border-r border-slate-850/60 transition-transform transform translate-x-0 ${
                  alert.severity === 'Critical' ? 'border-rose-500' : 'border-amber-500'
                }`}
              >
                <div className="flex gap-3">
                  <ShieldAlert className={`w-4 h-4 mt-0.5 ${alert.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`} />
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${alert.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {alert.type} // Severity: {alert.severity}
                    </span>
                    <p className="text-xs text-slate-300 font-mono mt-0.5 leading-relaxed">{alert.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


