# Weather App

Weather app: fetches live data from OpenWeatherMap for the cities in
`cities.json`, computes a custom **Comfort Index Score (0-100)** for each,
ranks them, and displays it all in a responsive React dashboard.

## Stack

- **Backend:** Node.js, Express, TypeScript, Zod validation, node-cache
- **Frontend:** React, TypeScript, Vite, Tailwind CSS

## Project layout

```
backend/
  src/
    config/       env loading, cities.json loader
    types/        Zod schemas + shared TS types
    services/     weather fetch, comfort index math, dashboard and Cache
    controllers/  thin HTTP handlers
    routes/       route wiring
    middleware/   async wrapper, global error handler
    app.ts        Express app
    server.ts     process entry point
  data/cities.json
frontend/
  src/
    components/   Dashboard, CityCard, loading/error states
    hooks/        useDashboard (fetch + loading/error state)
    services/     typed API client
    types/        response types
```

The backend follows a **layered / clean architecture**:  
routes > controllers > services > external provider + cache, with Zod validating every
boundary (config, cities.json, and the OpenWeatherMap response) so bad data
fails loudly instead of silently corrupting the dashboard.

## Setup

### Backend

```bash
cd backend
cp .env.example .env        # add your OpenWeatherMap API key
npm install
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env        # points at the backend URL
npm install
npm run dev                 # http://localhost:5173
```

### Endpoints

| Method | Path                     | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| GET    | `/api/dashboard`         | Ranked comfort index for every city       |
| GET    | `/api/debug/cache`       | Cache HIT/MISS + hit-rate stats           |
| POST   | `/api/debug/cache/flush` | Clears both caches (useful while testing) |
| GET    | `/health`                | Liveness check                            |

## Cities

`cities.json` now has **15 cities** the original 8 plus **Dubai, Singapore, New York, London, Berlin, Madrid** and **Moscow**, both verified real
OpenWeatherMap city IDs. The loader works with any list length, so
more cities can be added the same way at any time.

## Comfort Index formula

The score is a weighted sum of four sub scores, each 0 to 100, each measuring
how close a reading is to a "comfortable" reference point:

| Factor      | Weight | Ideal point           | Penalty                        |
| ----------- | ------ | --------------------- | ------------------------------ |
| Temperature | 40%    | 21°C                  | −4 pts per °C away from ideal  |
| Humidity    | 25%    | 50% relative humidity | −2 pts per % away from ideal   |
| Wind speed  | 20%    | ≤ 3 m/s (calm)        | −8 pts per m/s beyond 3 m/s    |
| Cloudiness  | 15%    | 40% cloud cover       | −1.2 pts per % away from ideal |

Each sub score is clamped to (0, 100) before weighting; the final score is
clamped again and rounded to 2 decimals.

**Reasoning behind the weights:**

- **Temperature gets the highest weight (40%)** because it's the single
  biggest driver of how comfortable a place feels it dominates subjective
  comfort ratings in most thermal comfort research, and it's the number
  people check first.
- **Humidity (25%)** compounds temperature: high humidity makes heat feel
  worse and cold feel damp, so it's the second strongest factor.
- **Wind (20%)** is modeled asymmetrically calm air (≤3 m/s) is free of
  penalty, but the penalty accelerates quickly past that, since strong wind
  degrades comfort faster than it
  improves a hot one.
- **Cloudiness (15%)** gets the smallest weight because it's the weakest,
  most subjective factor some people prefer sun, others shade so it's
  modeled as a mild preference for partial cover (~40%) over either extreme,
  and weighted low enough that it nudges rather than dominates the score.

## Caching design

Two independent in memory caches (5-minute TTL, configurable via
`CACHE_TTL_SECONDS`):

1. **Raw provider cache** - one entry per city, keyed by city code. Avoids
   re hitting OpenWeatherMap for every dashboard load.
2. **Processed dashboard cache** - one entry holding the fully scored +
   ranked payload, so repeat dashboard requests within the TTL skip both the
   network call and the scoring, sorting work.

`GET /api/debug/cache` reports HIT/MISS and hit rate for both, and the
dashboard response includes an `X-Cache-Status` header. Caching is in memory.

## Authentication & Authorization (Auth0)

- **Backend**: every `/api/*` route (`/api/dashboard`, `/api/debug/cache`,
  `/api/auth`) requires a valid Auth0 issued access token. `checkJwt`
  (`express-oauth2-jwt-bearer`) verifies the token's signature against
  Auth0's JWKS, issuer, audience and expiry. A second middleware,
  `requireAllowlistedEmail`, independently re checks the user's email against a
  server side allowlist defense in depth on top of Auth0's own
  "no public sign ups" restriction.
- **Frontend**: `@auth0/auth0-react` wraps the app. Unauthenticated users
  see a login screen (`AuthGate`); once logged in, the dashboard fetches an
  access token via `getAccessTokenSilently()` and sends it as
  `Authorization: Bearer <token>` on every API call. A logout button is in
  the dashboard header.
- **MFA**: enforced via Auth0 tenant configuration see setup steps below.
- **Restricted signups**: public signups disabled on the database
  connection; only manually created whitelisted users can log in.

## Auth0 dashboard setup

1. **Create a Single Page Application** (the React frontend uses
   Authorization Code + PKCE):
   - Auth0 Dashboard > Applications > Create Application > **Single Page
     Application**.
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
   - Copy the **Domain** and **Client ID** into `frontend/.env`
     (`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`).

2. **Create an API** (this is what the backend validates tokens against):
   - Auth0 Dashboard > Applications > APIs > Create API.
   - Identifier (this is the **audience**, not a real URL, doesn't need to
     resolve): `https://weather-api.local`
   - Put this same value in `backend/.env` (`AUTH0_AUDIENCE`) and
     `frontend/.env` (`VITE_AUTH0_AUDIENCE`).
   - Put your tenant's issuer (`https://YOUR_TENANT.auth0.com/` note the
     trailing slash) in `backend/.env` (`AUTH0_ISSUER_BASE_URL`).

3. **Disable public sign-ups**:
   - Auth0 Dashboard > Authentication > Database > (your connection, e.g.
     "Username-Password-Authentication") > Settings.
   - Turn **Disable Sign Ups** ON.

4. **Create the whitelisted test user**:
   - Auth0 Dashboard > User Management > Users > Create User.
   - Email: `careers@fidenz.com`, Password: `Pass#fidenz`.
   - Add any reviewer emails you want to allow the same way, and list them
     in `backend/.env` under `AUTH0_ALLOWED_EMAILS` (comma separated).

5. **Enable MFA (email factor)**:
   - Auth0 Dashboard > Security > Multi-factor Auth.
   - Enable **Email** as a factor.
   - Under "Define policies", set MFA to **Always Require MFA** (or
     configure an Adaptive MFA policy if you're on a plan that supports
     it).

6. **Deploy the post login Action** (adds the email custom claim + belt-
   and-braces MFA enforcement):
   - Auth0 Dashboard > Actions > Library > Build Custom > paste in

   ```javascript
   const AUDIENCE = "https://weather-api.local";
   exports.onExecutePostLogin = async (event, api) => {
     if (event.user.email) {
       api.accessToken.setCustomClaim(`${AUDIENCE}/email`, event.user.email);
       api.idToken.setCustomClaim(`${AUDIENCE}/email`, event.user.email);
     }
     // Force MFA (email factor) on every login, not just risk-based challenges.
     if (event.authentication?.methods?.every((m) => m.name !== "mfa")) {
       api.multifactor.enable("any", { allowRememberBrowser: false });
     }
   };
   ```

   (update `AUDIENCE` at the
   top if you used a different API identifier).
   - Actions > Triggers > post-login > drag your new Action into the flow > Apply.

## Environment variables

`backend/.env` additions (see `backend/.env.example`):

```
API_SERVER_PORT=5000
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
CACHE_TTL_SECONDS=300
CORS_ORIGIN=http://localhost:5173

AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.auth0.com/
AUTH0_AUDIENCE=https://weather-api.local
AUTH0_ALLOWED_EMAILS=careers@fidenz.com
```

`frontend/.env` additions (see `frontend/.env.example`):

```
VITE_API_BASE_URL=http://localhost:5000

VITE_AUTH0_DOMAIN=YOUR_TENANT.auth0.com
VITE_AUTH0_CLIENT_ID=your_spa_client_id
VITE_AUTH0_AUDIENCE=https://weather-api.local
```
