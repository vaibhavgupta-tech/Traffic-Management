import { connectDatabase } from "../config/database.js";
import { publishPacket, setSimulatorDatabase } from "../services/simulator.js";
import { Server } from "socket.io";
import http from "node:http";

const server = http.createServer();
const io = new Server(server);

const dbEnabled = await connectDatabase();
setSimulatorDatabase(dbEnabled);

for (let index = 0; index < 120; index += 1) {
  await publishPacket(io);
}

console.log("Seeded 120 demo packets.");
process.exit(0);
