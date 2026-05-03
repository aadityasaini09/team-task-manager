# Deploy on Railway (this repo)

You need **two Railway services** from the same GitHub repo: **API** (Node) and **Web** (static Vite build + `serve`).

## 1. Backend service (API)

1. Railway → **New Project** → **Deploy from GitHub** → select `team-task-manager`.
2. Add a service → same repo → open **Settings**:
   - **Root Directory**: `server`
   - **Start Command** (if not auto): `npm start`
3. **Variables** (service → Variables):
   - `MONGODB_URI` — MongoDB Atlas connection string (or Railway MongoDB plugin).
   - `JWT_SECRET` — long random string.
   - `NODE_ENV` = `production`
   - `CLIENT_ORIGIN` — after the frontend has a public URL, set it here (exact origin, no path), e.g. `https://your-web.up.railway.app`. Multiple: comma-separated, no spaces.
4. **Networking** → **Generate Domain** → copy the URL (example: `https://team-task-manager-api.up.railway.app`). This is your **API base** (no `/api` suffix).

## 2. Frontend service (Web)

1. **New** → **GitHub Repo** → same repository.
2. **Settings**:
   - **Root Directory**: `client`
   - **Build Command** (if needed): `npm ci && npm run build`
   - **Start Command**: `npm start` (serves `dist` with SPA fallback; Railway sets `PORT` automatically)
3. **Variables** (must be present **before** build so Vite can embed them):
   - `VITE_APP_BASE_URL` = your **backend** public URL from step 1, e.g. `https://team-task-manager-api.up.railway.app` (no trailing slash).
4. **Networking** → **Generate Domain** → copy the **frontend** URL.
5. Go back to the **backend** service and set `CLIENT_ORIGIN` to this **frontend** URL, then redeploy the API (or restart) so CORS allows the browser.

## 3. Order summary

1. Deploy API → get API URL.  
2. Deploy Web with `VITE_APP_BASE_URL` = API URL → get Web URL.  
3. Set API `CLIENT_ORIGIN` = Web URL → redeploy API.

## 4. First admin user

The UI registers users as non-admin. Create an admin once (MongoDB Atlas or Compass): set `isAdmin: true` on a user document, or call `POST /api/user/register` with `"isAdmin": true` using curl/Postman.
