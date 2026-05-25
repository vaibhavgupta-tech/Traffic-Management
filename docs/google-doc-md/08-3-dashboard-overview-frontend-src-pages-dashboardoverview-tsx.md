# 3. Dashboard Overview (frontend/src/pages/DashboardOverview.tsx)

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
      .catch(err => console.error(err));
  }, [livePackets]);


  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];


  return (
    <div className="space-y-6">
      {/* Metric Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Processed Load</p>
            <h3 className="text-2xl font-mono font-bold text-slate-100 mt-1">{stats.totalPackets + livePackets.length}</h3>
          </div>
          <Activity className="w-8 h-8 text-emerald-500 bg-emerald-500/10 p-1.5 rounded-lg" />
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Intrusion Alerts</p>
            <h3 className="text-2xl font-mono font-bold text-rose-400 mt-1">{alerts.length}</h3>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-500 bg-rose-500/10 p-1.5 rounded-lg" />
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Buffer Stream Velocity</p>
            <h3 className="text-2xl font-mono font-bold text-blue-400 mt-1">~1.25 p/s</h3>
          </div>
          <Cpu className="w-8 h-8 text-blue-500 bg-blue-500/10 p-1.5 rounded-lg" />
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Ingress IPs</p>
            <h3 className="text-2xl font-mono font-bold text-amber-400 mt-1">{stats.topIps?.length || 0}</h3>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-500 bg-amber-500/10 p-1.5 rounded-lg" />
        </div>
      </div>


      {/* Visual Data Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <h4 className="text-sm font-semibold tracking-wide text-slate-300 mb-4">L4/L7 Traffic Volume Distribution Matrix</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.protocolStats}>
                <XAxis dataKey="protocol" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <h4 className="text-sm font-semibold tracking-wide text-slate-300 mb-4">Top Network Traffic Ingress Contributors</h4>
          <div className="h-64 flex items-center justify-around">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.topIps} dataKey="count" nameKey="ip" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
                    {stats.topIps?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {stats.topIps?.map((item: any, index: number) => (
                <div key={item.ip} className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-mono text-slate-400 w-28 truncate">{item.ip}</span>
                  <span className="font-bold text-slate-300">({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Real-time Threat Alert Log View */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h4 className="text-sm font-semibold tracking-wide text-slate-300 mb-4">Real-time IDS Threat Intelligence Stream</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-xs font-mono text-slate-500">Zero threat indicators detected matching signature maps.</div>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-slate-950 border-l-4 border-rose-500 border-y border-r border-slate-850">
                <div className="flex gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">{alert.type}</span>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{alert.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


