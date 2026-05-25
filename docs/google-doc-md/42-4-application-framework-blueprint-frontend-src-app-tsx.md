# 4. Application Framework Blueprint (frontend/src/App.tsx)

TypeScript
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Shield, Activity, Terminal, ShieldAlert } from 'lucide-react';
import DashboardOverview from './pages/DashboardOverview';
import PacketLogsView from './pages/PacketLogsView';


// Establish connection channel back to secure telemetry node
const socket = io('http://localhost:5000');


export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [livePackets, setLivePackets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);


  useEffect(() => {
    socket.on('new-packet', (packet) => {
      // Implement clean client side circular buffer pagination to maintain rendering thread optimization
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
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans tracking-tight">
      
      {/* Structural Lateral Navigation Command Bar */}
      <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
            <Shield className="w-7 h-7 text-emerald-400" />
            <div>
              <h1 className="font-mono font-bold text-sm tracking-wider text-slate-200">CORE_DPI //</h1>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold tracking-widest">SECURE NETWORK APP</span>
            </div>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 font-bold' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" /> Operations Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'logs' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 font-bold' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> Live Packet Inspect
            </button>
          </nav>
        </div>
        
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/60 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Telemetry: Stream Live</span>
        </div>
      </aside>


      {/* Main Viewport Grid System */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between shadow-sm backdrop-blur-sm bg-slate-900/20">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono bg-slate-800/80 text-slate-300 px-3 py-1 rounded border border-slate-700/50 uppercase tracking-widest">NODE_ID: US_EAST_STAGING</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="tracking-wider uppercase">Active Threat Buffers: <strong className="text-rose-400 font-bold">{alerts.length}</strong></span>
          </div>
        </header>


        {/* View Component Injector Section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
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


