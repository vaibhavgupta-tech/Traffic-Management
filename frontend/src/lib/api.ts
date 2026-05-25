import axios from "axios";
import type { DashboardAnalytics, PacketResponse, ThreatAlert } from "../types";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000
});

export interface PacketFilters {
  search?: string;
  ip?: string;
  protocol?: string;
  port?: string;
  packetType?: string;
  severity?: string;
  page?: number;
  limit?: number;
}

export async function fetchPackets(filters: PacketFilters) {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined));
  const { data } = await api.get<PacketResponse>("/packets", { params });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get<DashboardAnalytics>("/analytics/dashboard");
  return data;
}

export async function fetchAlerts() {
  const { data } = await api.get<{ data: ThreatAlert[] }>("/alerts");
  return data.data;
}

export function exportUrl(format: "csv" | "json") {
  return `${API_URL}/packets/export/${format}`;
}
