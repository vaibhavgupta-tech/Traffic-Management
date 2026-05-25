# client\src\hooks\usePackets.ts



``ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { API_URL, api, cleanParams } from "../lib/api";
import { DashboardData, Packet, PacketFilters, ThreatAlert } from "../types/network";


const emptyFilters: PacketFilters = { search: "", sourceIp: "", destinationIp: "", protocol: "", port: "", packetType: "", from: "", to: "" };


export function usePackets() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<PacketFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const activeParams = useMemo(() => cleanParams(filters, page), [filters, page]);


  const fetchPackets = useCallback(async () => {
    const { data } = await api.get("/packets", { params: activeParams });
    setPackets(data.items);
    setPages(data.pages || 1);
  }, [activeParams]);


  const fetchDashboard = useCallback(async () => {
    const { data } = await api.get("/packets/analytics/dashboard");
    setDashboard(data);
    setAlerts(data.alerts);
  }, []);


  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPackets(), fetchDashboard()]).finally(() => setLoading(false));
  }, [fetchPackets, fetchDashboard]);


  useEffect(() => {
    const socket = io(API_URL, { withCredentials: true });
    socket.on("packet:new", (packet: Packet) => {
      setPackets((current) => [packet, ...current].slice(0, 25));
      fetchDashboard();
    });
    socket.on("alert:new", (alert: ThreatAlert) => setAlerts((current) => [alert, ...current].slice(0, 8)));
    return () => {
      socket.disconnect();
    };
  }, [fetchDashboard]);


  return { packets, alerts, dashboard, filters, setFilters, page, setPage, pages, loading, refetch: fetchPackets };
}


client\src\lib\api.ts
``ts
import axios from "axios";
import { PacketFilters } from "../types/network";
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
export const api = axios.create({
baseURL: ${API_URL}/api,
timeout: 10000,
withCredentials: true
});
export function cleanParams(filters: PacketFilters, page = 1, limit = 25) {
return Object.fromEntries(
Object.entries({ ...filters, page, limit })
.filter(([, value]) => value !== "" && value !== undefined && value !== null)
.map(([key, value]) => [key, String(value)])
);
}


