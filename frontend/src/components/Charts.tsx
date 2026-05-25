import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardAnalytics } from "../types";

const colors = ["#38d9ff", "#7cff9e", "#f7c948", "#ff5c7a", "#b794f4", "#fb7185", "#67e8f9", "#a3e635"];

export function Charts({ analytics }: { analytics: DashboardAnalytics }) {
  return (
    <div id="analytics" className="grid gap-4 xl:grid-cols-3">
      <section className="rounded-lg border border-line bg-panel/80 p-4 xl:col-span-2">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white">Packet Activity Timeline</h2>
          <p className="text-sm text-slate-400">Minute-bucket packet flow and volume</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={analytics.trafficTimeline}>
              <CartesianGrid stroke="#223047" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} />
              <Tooltip contentStyle={{ background: "#090d14", border: "1px solid #223047", color: "#fff" }} />
              <Line type="monotone" dataKey="packets" stroke="#38d9ff" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="bytes" stroke="#7cff9e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel/80 p-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white">Protocol Usage</h2>
          <p className="text-sm text-slate-400">DPI classification share</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={analytics.protocolStats} dataKey="value" nameKey="name" innerRadius={58} outerRadius={94} paddingAngle={3}>
                {analytics.protocolStats.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#090d14", border: "1px solid #223047", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel/80 p-4 xl:col-span-3">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white">Top Active Source IPs</h2>
          <p className="text-sm text-slate-400">Highest packet count in the current window</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={analytics.topIps}>
              <CartesianGrid stroke="#223047" vertical={false} />
              <XAxis dataKey="ip" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} />
              <Tooltip contentStyle={{ background: "#090d14", border: "1px solid #223047", color: "#fff" }} />
              <Bar dataKey="count" fill="#38d9ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
