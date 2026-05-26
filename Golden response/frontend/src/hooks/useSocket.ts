import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../lib/api";
import type { PacketLog, ThreatAlert } from "../types";

export function useSocket(onPacket: (packet: PacketLog) => void, onAlert: (alert: ThreatAlert) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"]
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("packet:new", onPacket);
    socket.on("alert:new", onAlert);

    return () => {
      socket.disconnect();
    };
  }, [onAlert, onPacket]);

  return connected;
}
