# Talkora — Chat App Frontend

React + Vite frontend for the Talkora chat backend.

## Stack
React 19, Vite, Tailwind CSS v4 + DaisyUI, React Router, Axios, Zustand,
React Hook Form, React Hot Toast, Framer Motion, Lucide React, Stream Chat.

## Setup
```bash
npm install
cp .env.example .env   # add your Stream API key
npm run dev
```

Backend is expected at `http://localhost:5001/api` (see `src/lib/axios.js`).
Auth uses an HTTP-only JWT cookie (`withCredentials: true`), so the backend
must set the cookie with `SameSite`/`CORS` config that allows the Vite dev
origin (`http://localhost:5173`) with credentials.

## Env vars
- `VITE_STREAM_API_KEY` — Stream Chat public API key (used with the
  `/chat/token` backend endpoint to connect the chat client).

## Structure
```
src/
  api/         axios wrappers per resource (auth, users, chat)
  components/
    common/    shared UI: layout, route guards, cards, avatar, etc.
  hooks/       useStreamClient (Stream Chat connection)
  lib/         axios instance, stream client singleton
  pages/       one file per route
  store/       zustand stores (auth, users, theme)
  constants/   nav config
```

## Routing
- `/` — public landing page
- `/login`, `/signup` — public-only (redirect away if authenticated)
- `/onboarding` — requires auth, blocks if already onboarded
- `/home`, `/friends`, `/friend-requests`, `/discover`, `/profile`,
  `/settings`, `/chat/:id` — protected, require auth + completed onboarding

## Notes
- Dark mode is a DaisyUI theme pair (`talkora` / `talkora-dark`), toggled from
  the navbar or Settings, persisted to `localStorage`.
- Chat assumes a Stream Chat backend integration behind `/chat/token`. If
  your backend uses a different provider, `useStreamClient`/`ChatPage` are
  the two files to swap out.
