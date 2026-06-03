# justanotherun-lab

Personal running intelligence dashboard powered by Strava.

## Stack

| Layer    | Tech                        | Host   |
|----------|-----------------------------|--------|
| Backend  | FastAPI + SQLAlchemy        | Render |
| Frontend | React + Vite + Recharts     | Vercel |
| Auth     | Strava OAuth 2.0 + JWT      | —      |
| DB       | SQLite (dev) / Postgres (prod) | —   |

---

## Setup

### 1. Backend (Render)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in your values in .env
uvicorn main:app --reload
```

**Environment variables on Render:**
```
STRAVA_CLIENT_ID=238201
STRAVA_CLIENT_SECRET=<your_secret>
STRAVA_REDIRECT_URI=https://<your-render-url>/auth/strava/callback
JWT_SECRET=<random 32+ char string>
FRONTEND_URL=https://<your-vercel-url>
ALLOWED_ORIGINS=https://<your-vercel-url>
```

**Render settings:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

### 2. Frontend (Vercel)

```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL to your Render backend URL
npm run dev
```

**Environment variable on Vercel:**
```
VITE_API_URL=https://<your-render-url>
```

---

### 3. Strava App settings

In strava.com/settings/api, set:
- **Authorization Callback Domain:** `<your-render-url>` (no https://)

---

## Usage

1. Open the app → Connect with Strava
2. Hit **SYNC** on the dashboard to import all your activities
3. Browse activities, filter by sport type
4. Monthly chart shows your running volume

## Roadmap

- [ ] Garmin export import (sleep, HRV, wellness)
- [ ] AI coach (Gemini API)
- [ ] Personal records tracking
- [ ] Training load / fitness curve
- [ ] Detailed activity view with map
