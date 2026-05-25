# server\src\services\packetSimulator.ts



``ts
import { Server } from "socket.io";
import { Packet } from "../models/Packet.js";
import { inspectPacket } from "./threatDetection.js";


const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH"] as const;
const packetTypes = ["inbound", "outbound", "internal"] as const;
const ports = [22, 53, 80, 123, 443, 993, 3306, 5432, 8080, 3389];
const seedIps = ["10.0.0.15", "10.0.0.24", "172.16.4.20", "192.168.1.44", "45.155.205.233", "185.220.101.44"];


function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}


export function startPacketSimulator(io: Server) {
  return setInterval(async () => {
    const packet = await Packet.create({
      sourceIp: pick(seedIps),
      destinationIp: `10.10.${Math.floor(Math.random() * 25)}.${Math.floor(Math.random() * 255)}`,
      protocol: pick(protocols),
      port: pick(ports),
      size: Math.floor(Math.random() * 1450) + 64,
      packetType: pick(packetTypes),
      payloadPreview: "Simulated DPI metadata only"
    });


    io.emit("packet:new", packet);
    const alerts = await inspectPacket(packet.toObject());
    alerts.forEach((alert) => io.emit("alert:new", alert));
  }, 1200);
}


server\src\services\python_ingest_example.py
``py
"""
Optional packet ingestion bridge.
Run with administrator/root privileges only on networks you are authorized to monitor.
This example posts metadata to the Express API and intentionally avoids storing raw payloads.
"""
import os
import requests
from scapy.all import IP, TCP, UDP, sniff
API_URL = os.getenv("DPI_API_URL", "http://localhost:8080/api/packets")
def protocol_name(packet):
if packet.haslayer(TCP):
port = int(packet[TCP].dport)
if port == 443:
return "HTTPS"
if port == 80:
return "HTTP"
if port == 22:
return "SSH"
return "TCP"
if packet.haslayer(UDP):
if int(packet[UDP].dport) == 53:
return "DNS"
return "UDP"
return "OTHER"
def handle_packet(packet):
if not packet.haslayer(IP):
return
port = 0
if packet.haslayer(TCP):
    port = int(packet[TCP].dport)
elif packet.haslayer(UDP):
    port = int(packet[UDP].dport)


event = {
    "sourceIp": packet[IP].src,
    "destinationIp": packet[IP].dst,
    "protocol": protocol_name(packet),
    "port": port,
    "size": len(packet),
    "packetType": "inbound",
    "payloadPreview": "Captured metadata from Scapy bridge",
}
requests.post(API_URL, json=event, timeout=3)
if name == "main":
sniff(prn=handle_packet, store=False)


