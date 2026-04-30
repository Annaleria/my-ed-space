# MES Core Flow – Full Stack Exercise

## Overview

This project implements a simplified version of the MyEdSpace core user journey:
Parent purchases → Student onboards → Student accesses the LMS

The goal was to design and build a small full-stack application that demonstrates clear system structure, pragmatic engineering decisions, and an end-to-end product flow.

## Architecture

The application is structured as a lightweight monorepo:

```
Frontend (React SPA)
         ↓
Backend (Node.js API - Express)
         ↓
Database (PostgreSQL)
```

## Repository Structure

```
project-root/
├── apps/
│   ├── frontend/                        # React (Vite)
│   │   └── src/
│   │       ├── pages/
│   │       ├── components/
│   │       └── api/
│   └── backend/                         # Node API
│       └── src/
│           ├── routes/                  # Express handlers
│           ├── services/                # Business logic
│           │   ├── purchaseService.ts
│           │   ├── onboardingService.ts
│           │   ├── lmsService.ts
│           │   └── authService.ts
│           ├── repositories/            # DB interaction
│           └── utils/                   # Shared helpers
├── packages/
│   └── shared/                          # Shared TS types
├── .devcontainer/
├── docker/
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

## Core User Flow

1. **Parent Purchase**
   - Parent lands on a product page
   - Parent selects a course
   - Parent completes a mock checkout (no real payment integration required)
   - After purchase, the system generates a student access path (e.g. invitation link)

Handled by: purchaseService

2. **Student Onboarding**
   - Student accesses onboarding via the invitation or purchase outcome
   - Student completes a basic onboarding form
   - Student activates their account (e.g. sets a password, no real auth system required)
   - On completion, the student can access the platform

Handled by: onboardingService

3. **LMS Access**
   - Only authenticated students can access the LMS
   - LMS contains a simple dashboard
   - LMS shows a list of lessons
   - Students can get access to a lesson

Handled by: lmsService, sessionService

## Key Technical Decisions

1. **Monorepo Structure**

Frontend, backend, and shared types are co-located to:

- simplify development
- maintain type-safe contracts
- reduce integration overhead

2. **Layered Backend Design**

The backend follows a clear separation of concerns:

- Routes → HTTP layer (Express handlers)
- Services → business logic (core flows)
- Repositories → data access
- Utils → shared helpers

This keeps business logic isolated and easy to reason about.

3. **Flow-Oriented Service Design**

Services are organised around the user journey, not technical categories:

- purchaseService
- onboardingService
- lmsService
- sessionService

This keeps the system aligned with product behaviour and makes flows easy to evolve.

4. **Invitation-Based Onboarding**

Purchases generate an invitation token, rather than creating a student immediately.

This reflects real-world systems where:

- payment and user creation are decoupled
- onboarding happens asynchronously

5. **Simplified Authentication**

Authentication is intentionally minimal:

- session simulated via client-side storage
- no JWT or external auth provider

This keeps focus on the core product flow while still modelling access control.

6. **Lightweight LMS**

Lessons are simplified and not fully dynamic.

The focus is on:

- access control
- flow completion
- user experience

## Running the Application

### Prerequisites

- Docker
- Docker Compose

### Start the application

```bash
docker compose up
```

This will start:

- frontend (React)
- backend (Node.js API)
- database (PostgreSQL)

### Access the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## AI Usage

AI tools were used to accelerate development, particularly for:

- scaffolding React components
- generating API route boilerplate
- assisting with Docker configuration

The development process followed an iterative approach:

1. System design and architecture were defined upfront
2. AI was used to generate initial implementations
3. Outputs were reviewed, refined, and simplified

All architectural decisions, data modelling, and flow design were made independently to ensure clarity and correctness.

## Future Improvements

Given more time, the following enhancements would be made:

- proper authentication (JWT/session handling)
- persistent lesson/content management
- validation and error handling improvements
- test coverage (unit + integration)
- improved UX (loading states, error feedback)
- role separation (parent vs student views)
