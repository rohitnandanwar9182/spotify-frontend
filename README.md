# Reel — frontend for complete-backend (SPOTIFYCLAUDED)

React + Vite + Tailwind v4 frontend for your `complete-backend` music streaming API.

## 1. Install

```
npm install
```

## 2. Configure the API URL

Copy `.env.example` to `.env` and point it at wherever the backend runs:

```
VITE_API_URL=http://localhost:3000
```

## 3. Run it

```
npm run dev
```

Opens on `http://localhost:5173`.

## ⚠️ Required backend change: enable CORS

Your `complete-backend` has no `cors` middleware installed, and the frontend and
backend run on different ports (5173 vs 3000). Without CORS, every request from
the frontend will be blocked by the browser, and login won't be able to set its
cookie. This isn't optional — nothing will work until you add it.

Install it in the backend project:

```
npm install cors
```

Then in `src/app.js`, add it **before** your routes:

```js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // your Vite dev server
  credentials: true,               // required so the auth cookie can be sent/received
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;
```

`origin` can't be `'*'` when `credentials: true` — it must be the exact frontend
origin. When you deploy the frontend (e.g. to Vercel), add that deployed URL as
well (an array of origins works: `origin: ['http://localhost:5173', 'https://your-app.vercel.app']`).

## How auth works here (and its limits)

- Login/register set a `token` cookie; there's no `Authorization` header involved.
- Every API call from the frontend uses `axios` with `withCredentials: true` so the
  cookie is sent automatically.
- **There's no `GET /api/auth/me` endpoint in the backend**, so the frontend can't
  ask "is my cookie still valid?" on page load. It stores the last known user in
  `localStorage` just to avoid a flash of the logged-out UI on refresh — if the
  cookie has actually expired, the next API call will 401 and you'll be sent back
  to `/login`. If you want a real session check, add a small `/api/auth/me` route
  that reads `req.cookies.token`, verifies it, and returns the user.

## How albums work here (and their limits)

- `POST /api/music/album` takes a `musics` array of **IDs**, but there's no
  "list my uploaded tracks" endpoint for artists (`GET /api/music/` requires the
  `user` role, not `artist`). So the Artist Dashboard keeps a running list of
  tracks you've uploaded **during the current session** and lets you build an
  album from those. Refreshing the page clears that list. If you want artists to
  build albums from tracks uploaded in past sessions, add a
  `GET /api/music/mine` endpoint scoped to `req.user.id`.

## Pages

- `/login`, `/register` — auth, with a user/artist toggle on register
- `/browse` — all tracks (user role)
- `/albums`, `/albums/:albumId` — album list and detail (user role)
- `/dashboard` — upload tracks + create albums (artist role)

## Structure

```
src/
  api/axios.js          axios instance (withCredentials: true)
  context/AuthContext    login/register/logout + localStorage persistence
  context/PlayerContext  audio element, queue, play/pause/seek
  components/           Navbar, Deck (bottom player bar), ProtectedRoute, TrackRow
  pages/                 Login, Register, Browse, Albums, AlbumDetail, ArtistDashboard, NotFound
```
