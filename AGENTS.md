# AI Coding Agent Instructions for MyEdSpace

This file provides essential guidance for AI coding agents working in the MyEdSpace monorepo. It summarizes project structure, build/test commands, and key conventions. For details, always refer to the linked documentation.

## Project Overview

- **Monorepo**: Contains frontend (React/Vite), backend (Node.js/Express), and shared TypeScript types.
- **Architecture**: Layered backend (routes, services, repositories, utils) and flow-oriented service design (purchase, onboarding, LMS, session).
- **See**: [apps/frontend/README.md](apps/frontend/README.md) and [MES Core Flow – Full Stack Exercise](apps/frontend/README.md) for frontend and architecture details.

## Build & Run Commands

- **Root** (all apps):
  - `pnpm install` – install dependencies
  - `pnpm dev` – run all apps in dev mode
  - `pnpm build` – build all apps
  - `pnpm start` – start backend only
- **Frontend**:
  - `pnpm --filter frontend dev` – start frontend dev server
  - `pnpm --filter frontend build` – build frontend
- **Backend**:
  - `pnpm --filter backend dev` – start backend in watch mode
  - `pnpm --filter backend build` – build backend
  - `pnpm --filter backend start` – run backend
- **Docker**:
  - `docker compose up` – run full stack (frontend, backend, db)

## Key Conventions

- **Type Safety**: Shared types in `packages/shared`.
- **No `any` in TypeScript**: Do not use the `any` type in TypeScript code. Always specify a concrete type or interface for variables, state, props, and function arguments/returns. Use `unknown` or generics if absolutely necessary, but prefer explicit types for clarity and safety.
- **Type Guards & Types**: Always use proper TypeScript types and type guards to ensure type safety. Avoid unsafe casts and check types at runtime when handling untyped data (e.g., API input, JSON, unknown).
- **British English Spelling**: Use British English spelling in all code and comments (e.g., `colour`, `normalise`). This is a style choice for this UK-based project. New code should follow this convention for consistency.
- **Frontend API Endpoints**: All frontend network calls must use relative `/api` endpoints (e.g., `/api/courses`). This ensures requests work with the Vite dev proxy and Docker Compose service naming. Never hardcode backend hostnames or ports in frontend code.
- **Minimal Auth**: Session simulated client-side; no JWT/external provider.
- **Invitation Onboarding**: Purchases generate invitation tokens; onboarding is async.
- **Service Structure**: Backend services are named for user flows, not technical layers.

## Documentation

- [apps/frontend/README.md](apps/frontend/README.md): Frontend, ESLint, and Vite setup
- [MES Core Flow – Full Stack Exercise](README.md): Architecture, flows, and technical decisions

## Recommendations for AI Agents

- **Link, don’t duplicate**: Always link to existing documentation.
- **Minimal by default**: Only add what’s not easily discoverable.
- **Concise and actionable**: Every line should guide behavior.

---

_Last updated: 2026-04-29_
