# 🚀 Orchestration and Environment Assembly Instruction Set

Follow these structural workspace commands sequentially to spin up both operational segments concurrently on your host ecosystem environment:
Bash
# ==========================================
# PHASE I: CONFIGURE AND RUN THE BACKEND SERVER
# ==========================================
cd backend


# Populate the environment file
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/dpi-security" >> .env
echo "CORS_ORIGIN=http://localhost:5173" >> .env


# Pull assets and spin up the dev loop
npm install
npm run dev

