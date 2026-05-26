import type { Severity } from "../types";

export function severityClass(severity: Severity) {
  return {
    low: "bg-acid/10 text-acid",
    medium: "bg-amber/10 text-amber",
    high: "bg-danger/10 text-danger",
    critical: "bg-red-500/20 text-red-200"
  }[severity];
}
