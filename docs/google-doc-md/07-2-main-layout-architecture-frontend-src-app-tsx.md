# 2. Main Layout Architecture (frontend/src/App.tsx)

TypeScript
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Shield, Activity, Terminal, AlertTriangle, Layers } from 'lucide-react';
import DashboardOverview from './pages/DashboardOverview';
import PacketLogsView from './pages/PacketLogsView';


const socket = io('http://localhost:5000');


export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [livePackets, setLivePackets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);


  useEffect(() => {
    socket.on('new-packet', (packet) => {
      setLivePackets((prev) => [packet, ...prev.slice(0, 49)]);
    });


    socket.on('new-alert', (alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
    });


    return () => {
      socket.off('new-packet');
      socket.off('new-alert');
    };
  }, []);


  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Structural Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
            <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
            <div>
              <h1 className="font-bold text-md tracking-wider text-slate-200">CORE-DPI</h1>
              <span className="text-xs text-emerald-400 font-mono">SOC SECURE NODE</span>
            </div>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" /> Operations Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'logs' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> Live Packet Inspect
            </button>
          </nav>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-slate-400">Stream Status: Live</span>
        </div>
      </aside>


      {/* Main Viewport Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">Environment: Staging_Net</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
            <span>SYS_ALERTS: <strong className="text-rose-400">{alerts.length}</strong></span>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <DashboardOverview livePackets={livePackets} alerts={alerts} />
          ) : (
            <PacketLogsView initialPackets={livePackets} />
          )}
        </div>
      </main>
    </div>
  );
}


