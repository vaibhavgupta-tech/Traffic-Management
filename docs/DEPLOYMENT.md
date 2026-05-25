# Deployment

## Backend on Render or Railway

1. Create a Node.js service from this repository.
2. Set root directory to `backend` if the platform deploys a single package, or use the root workspace commands.
3. Add environment variables:

```env
NODE_ENV=production
PORT=4000
CLIENT_ORIGIN=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/sentineldpi
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=240
SIMULATOR_ENABLED=true
SIMULATOR_INTERVAL_MS=1100
```

4. Build command:

```bash
npm install && npm run build --workspace backend
```

5. Start command:

```bash
npm run start --workspace backend
```

## Frontend on Vercel or Netlify

1. Set project root to `frontend`.
2. Add environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

3. Build command:

```bash
npm run build
```

4. Publish directory:

```txt
dist
```

## Production Notes

- Use MongoDB Atlas or a managed MongoDB service.
- Configure `CLIENT_ORIGIN` to the exact frontend URL.
- Disable the simulator when using a real collector: `SIMULATOR_ENABLED=false`.
- Place the API behind HTTPS.
- Keep packet payloads summarized or hashed to avoid storing sensitive raw content.
- Add authentication before exposing the dashboard publicly.
- For real packet capture, run a privileged collector service separately and push normalized packet metadata into this backend.
