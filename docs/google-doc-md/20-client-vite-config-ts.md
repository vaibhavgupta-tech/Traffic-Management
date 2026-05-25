# client\vite.config.ts



``ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});


docker-compose.yml
``yaml
services:
mongodb:
image: mongo:7
container_name: dpi-sentinel-mongodb
restart: unless-stopped
ports:
- "27017:27017"
volumes:
- mongo_data:/data/db
volumes:
mongo_data:


