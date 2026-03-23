# Project Overview

- TravelMind is a full-stack travel companion app that helps users plan personalized trips anywhere in the world.
  It combines a native mobile client (React Native / Expo) with a REST API (Node.js / Express). Users enter a destination, dates, and an optional budget and receive a structured travel plan—day-by-day ideas, places to visit, hotel and restaurant suggestions, maps and imagery—driven by the app’s logic and integrations.
  Behind the scenes, AI (e.g. Hugging Face, Groq, or Gemini, depending on backend configuration) generates travel content, together with services such as Google Places (autocomplete / photos), Unsplash, Supabase (auth and data), and maps / routing in the client.
  The goal is to reduce manual research, present the trip in a clear UI (screens, cards, map), and give travelers a smart starting point for planning—not only a list of places, but a single, guided planning experience.

- React Native + Expo (mobile app)
- TypeScript (frontend + backend)
- Node.js + Express (API server)
- React Native Paper (UI)
- Zustand (client state)
- TanStack React Query (data fetching / caching)
- Supabase (auth / backend services)
- Async Storage (local persistence)
- react-native-maps (maps)
- expo-location (device location)
- @react-native-community/datetimepicker (dates)
- expo-auth-session / expo-web-browser / expo-crypto (OAuth flow)
- @expo/vector-icons / react-native-vector-icons (icons)
- expo-linear-gradient, react-native-safe-area-context, expo-status-bar (UI / layout)
- Helmet, CORS, compression, morgan (Express middleware)
- dotenv (env config)
- tsx + tsc (run / build backend)
- ESLint + TypeScript ESLint (linting)
- Hugging Face Inference (AI)
- Groq SDK (AI)
- Google Generative AI (Gemini) (AI)
- Google Places API (autocomplete, search, photos)
- Unsplash API (place images)
- OSRM (routing over the network in the app)

## Architecture

- **Monorepo**: Two separate packages — `frontend/` (Expo + React Native) and `backend/` (Express + Node).
- **Communication**: The app calls the backend REST API (`/api/...`) via `frontend/src/api/client.ts` and route-specific modules (e.g. `travel.ts`).
- **Frontend layers**
  - `src/screens/` — Screen-level UI and logic
  - `src/components/` — Shared components
  - `src/api/` — HTTP client and API wrappers
  - `src/store/` — Zustand stores (e.g. auth)
  - `src/hooks/`, `src/providers/`, `src/navigation/`, `src/constants/`, `src/types/`, `src/utils/`
- **Backend layers**
  - `src/index.ts` — Express app entry, middleware, route registration
  - `src/routes/` — API routes (`auth`, `travel`, `ai`, etc.)
  - `src/services/` — External integrations (AI, Places, Supabase, Unsplash, etc.)
  - `src/middleware/`, `src/types/`

## Commands

| Action                        | Command                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| **Install (backend)**         | `cd backend && npm install`                                        |
| **Install (frontend)**        | `cd frontend && npm install`                                       |
| **Run (backend)**             | `cd backend && npm run dev` → `http://localhost:3000`              |
| **Run (frontend)**            | `cd frontend && npm start` (Expo)                                  |
| **Run (iOS / Android / web)** | `cd frontend && npm run ios` / `npm run android` / `npm run web`   |
| **Test**                      | No `test` script in `package.json` yet — add Jest/Vitest if needed |
| **Build (backend)**           | `cd backend && npm run build` → `dist/`; production: `npm start`   |
| **Build (frontend)**          | Use EAS / `expo export` per your deployment flow                   |

# Rules

## Rules & conventions

- **Secrets**: Never commit `.env`. Keep API keys (Hugging Face, Groq, Google, Supabase, etc.) local or in CI secrets only.
- **API contracts**: Changes to request/response in `backend/src/routes` should be mirrored in `frontend/src/api` and shared types under `frontend/src/types` / `backend/src/types`.
- **TypeScript** on both frontend and backend.
- **Frontend**: Prefer screens under `screens/`; use React Query for server state where applicable.
- **Backend**: Put integration and heavy logic in `src/services/`, not only in route handlers.
- **Client env**: Use `EXPO_PUBLIC_*` only for values intentionally exposed to the client; sensitive keys stay on the backend.

# Key files

- backend/src/index.ts → entry point for the Express server (middleware, routes, listen)
- frontend/index.ts (and root App entry) → Expo / React Native app entry
- backend/src/routes/auth.ts → authentication HTTP routes (signup, login, session, etc.)
- frontend/src/store/authStore.ts (or your auth store file) → client auth state (Zustand + Supabase session)
- frontend/src/api/client.ts → API client (base URL, fetch, auth headers)
- backend/src/routes/travel.ts → travel plan generation and related integrations
- frontend/src/screens/HomeScreen/ → home search / destination flow

# Engineering Guidelines

- Prefer existing patterns over introducing new ones
- Keep components small and reusable
- Do not duplicate API logic — reuse existing services
- Validate inputs on both client and server
- Keep business logic in backend services, not routes
- Use React Query for all async server state
- Use Zustand only for client/global UI state

# Common Tasks

## Add new API endpoint

1. Create route under backend/src/routes/
2. Add logic in backend/src/services/
3. Update types
4. Update frontend/src/api/
5. Use React Query in frontend

## Add new screen

1. Create under frontend/src/screens/
2. Add navigation
3. Fetch data via React Query
4. Use existing components where possible

# Known Pitfalls

- Do not call external APIs directly from frontend — always go through backend
- Google Places responses must be normalized before sending to client
- AI responses may be inconsistent — always validate structure
- Supabase auth state must stay in sync with Zustand store

# Data Flow

User → Frontend Screen → React Query → API Client → Backend Route → Service → External API → Response → UI

# Definition of Done

- Code compiles with no TypeScript errors
- API and frontend types match
- No hardcoded values
- Uses existing patterns
- Handles loading + error states

# AI Integration Rules

- Always validate AI output before returning to client
- Keep prompts modular and reusable
- Do not hardcode prompts inside routes — use services
- Handle fallback if AI fails

# How to work with this project

When working on a task:

1. First, understand relevant files
2. Then propose a short plan
3. Then implement step by step
4. Do not change unrelated code

# Project Identity

This is a production-grade travel planning app.
Code quality, structure, and scalability are more important than quick hacks.

# Code Style

- Use clear and descriptive variable names
- Prefer early returns over nested conditions
- Keep functions small and focused
- Use async/await over then/catch
- Follow existing file structure and naming conventions

# Key Patterns

- API calls are wrapped in frontend/src/api/\*
- React Query handles all server state (no manual fetch in components)
- Backend routes are thin — logic lives in services
- Auth is managed via Supabase + Zustand store

# Where to look first

- Auth issues → backend/src/routes/auth.ts + frontend/src/store/authStore.ts
- Travel logic → backend/src/routes/travel.ts + services
- API issues → frontend/src/api/client.ts

# Do NOT

- Do not rewrite large parts of the codebase without reason
- Do not introduce new libraries unless necessary
- Do not move logic between frontend/backend without explanation
