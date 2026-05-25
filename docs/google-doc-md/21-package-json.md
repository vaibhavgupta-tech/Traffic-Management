# package.json



``json
{
  "name": "dpi-soc-monitor",
  "version": "1.0.0",
  "private": true,
  "description": "Professional Deep Packet Inspection SOC dashboard with real-time traffic monitoring.",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix server && npm run build --prefix client",
    "install:all": "npm install && npm install --prefix server && npm install --prefix client"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}


