import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "cyan" | "green" | "amber" | "red";
}

const toneMap = {
  cyan: "text-cyan bg-cyan/10 border-cyan/20",
  green: "text-acid bg-acid/10 border-acid/20",
  amber: "text-amber bg-amber/10 border-amber/20",
  red: "text-danger bg-danger/10 border-danger/20"
};

export function MetricCard({ label, value, detail, icon: Icon, tone }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-line bg-panel/75 p-4 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-md border p-2 ${toneMap[tone]}`} title={label}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </section>
  );
}
