# Reel — frontend for complete-backend (SPOTIFYCLAUDED)

React + Vite + Tailwind v4 frontend for your `complete-backend` music streaming API.

## 1. Install

```
npm install
```

## 2. Configure the API URL for local development

Copy `.env.example` to `.env` if the backend is not running on port 3000. The
Vite development server proxies `/api` requests to this URL:

```
VITE_API_URL=http://localhost:3000
```

## 3. Run it

```
npm run dev
```

Opens on `http://localhost:5173`.

## Deploy to Vercel

`vercel.json` proxies `/api/*` through the frontend's own origin to the Render
backend, and serves the Vite app for client-side routes such as `/dashboard`.
This keeps the authentication cookie first-party in the browser. If the backend
URL changes, update the rewrite destination in `vercel.json`. Do not set
`VITE_API_URL` in Vercel; the frontend uses same-origin `/api` requests there.

Login and registration set an HTTP-only `token` cookie. On page load, the
frontend validates that cookie using `GET /api/auth/me` and clears stale local
user state when the backend rejects it. The artist dashboard loads prior uploads
through `GET /api/music/mine`.

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
