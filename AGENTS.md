# MemoAI — AI-Powered Digital Diary
### Project brief for Google Antigravity

> **How to use this file**
> 1. Create an empty folder `memoai/` and open it as a workspace in Antigravity.
> 2. Save this file in the root as `AGENTS.md` (or keep it as `MEMOAI_ANTIGRAVITY.md` and reference it with `@`).
> 3. In the Agent Manager, start with this prompt:
>    *"Read AGENTS.md fully. Start with **Phase 1 only**. Produce an Implementation Plan artifact first, wait for my approval, then build. After the phase, run verification and give me a Walkthrough artifact. Do not start the next phase until I say so."*
> 4. Use **Planning mode** for each phase. Review the plan before approving.

---

## 0. Agent Operating Rules (read first)

1. **One phase at a time.** Never start the next phase without explicit approval.
2. **Plan before code.** For each phase, create an Implementation Plan artifact (files to create, commands to run, risks). Wait for approval.
3. **Verify before moving on.** After each phase: run the build, run tests, start the app, and use the **browser agent in Chrome** to test the UI (see Section 14). Fix console errors and obvious UI issues.
4. **Finish with a Walkthrough artifact** containing what was built, how it was tested, screenshots/recordings of the browser test, and known issues.
5. **Commit after every phase** with a Conventional Commit message (see Section 12). Never one giant commit.
6. **Core diary first.** The app must be fully functional as a plain diary (Phases 1–9) before any AI code is written.
7. **Never hard-code secrets or AI providers.** Use environment variables and provider abstractions.
8. **Privacy is non-negotiable.** A user must never be able to read, edit, search, or receive AI answers from another user's memories.
9. **Keep code beginner-friendly and clean.** Modular, DTO-validated, comments only where they add real value. No unnecessary features.
10. **Ask before destructive actions** (deleting files, resetting the DB, force pushes).

---

## 1. Project Overview

**MemoAI** is an **AI-powered digital diary**. Users record daily experiences, thoughts, important moments, travel memories, photos, locations, moods, and notes. AI helps them organize, search, understand, and rediscover those memories.

This is **not** a simple CRUD app. It must have a clean, modern, professional UI and a scalable architecture that supports AI analysis, semantic search, RAG, and personal insights.

**Tagline:** *"Your memories. Your story. One intelligent diary."*

**Final feeling:** *"A personal digital diary that remembers with you."*

Target: university-level full-stack software engineering project, suitable for academic documentation and demo.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS (Vite recommended) |
| Backend | Node.js, NestJS, REST API |
| Database | PostgreSQL (+ `pgvector` extension for embeddings) |
| ORM | TypeORM or Prisma (pick one, stay consistent) |
| Maps | Leaflet.js + OpenStreetMap |
| AI | LLM API + Embedding API (behind provider abstractions) |
| Dev tools | Git + GitHub, Postman, Docker |

---

## 3. Core Features

Users can: create, edit, delete, and view diary entries; add photos, mood, category, tags, date, location; search memories; view memories chronologically and on a map; ask AI questions about their diary; get AI summaries and insights.

**User flow:**
Landing → Register → Login → Dashboard → Create Diary → Save → Timeline → Search → Memory Map → Ask My Diary → Insights → Profile

---

## 4. Frontend Pages

### 4.1 Landing Page
MemoAI logo/name, tagline, hero section, "How it works", key features, CTA buttons (Get Started / Login). Clean, modern, emotional.

### 4.2 Authentication
- **Register:** name, email, password, confirm password
- **Login:** email, password, remember me, forgot-password UI (UI only)
- JWT on the backend.

### 4.3 Dashboard
"Welcome back, [Name] — *Capture today's story.*"

Cards: Total Memories, This Month, Places Visited, Favorite Mood.
Also: recent memories, quick **Write a Memory** and **Ask My Diary** buttons, small timeline, recent locations.

### 4.4 Digital Diary Editor (CORE FEATURE)
Fields: title, content, date, mood, category, tags, location, image upload.

It must feel like a real personal diary (paper-like writing area, soft typography), **not** an admin form.

**Moods:** Happy, Sad, Excited, Calm, Angry, Nostalgic, Grateful, Neutral
**Categories:** Personal, University, Study, Work, Travel, Family, Friends, Achievement, Other

### 4.5 Diary Timeline
Chronological, grouped by date. Example:

```
October 8, 2026
My First University Presentation — 😊 Proud

October 5, 2026
A Productive Day — 😌 Calm
```

Actions: open, edit, delete. Filters: date, category, mood. Plus search.

### 4.6 Memory Details Page
Title, full content, date, mood, category, tags, location, photos, AI summary (if available), related memories. A beautiful reading experience.

### 4.7 Memory Map
Leaflet + OpenStreetMap. Markers per location with memory counts (e.g., Dhaka → 15, Cox's Bazar → 8). Clicking a marker shows location name, count, and related entries; clicking an entry opens Memory Details.

### 4.8 Search
Normal search first by title, content, category, tags, location, date. Architecture must be ready for semantic/vector search later.

### 4.9 Ask My Diary
Chat-like interface. Example questions:
- "What did I do last month?"
- "When did I visit Cox's Bazar?"
- "What did I write about my university project?"
- "What were some of my happiest memories?"
- "What did I learn recently?"

Show the source memories used for each answer.

### 4.10 Personal Insights
Total memories, memories by month, by category, mood distribution, most visited locations, most common topics, plus AI-generated insights (e.g., "You wrote more about university projects this month."). Private to the authenticated user.

### 4.11 Profile
Name, email, profile image, password-change UI, account settings, logout.

---

## 5. Reusable Frontend Components

Navbar, Sidebar, MemoryCard, DiaryEditor, Timeline, MoodBadge, Tag, SearchBar, MemoryMap, ChatBox, InsightCard, Modal, LoadingState, EmptyState.

**Frontend structure**
```
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── hooks/
    ├── services/      # Axios API client layer
    ├── context/       # Auth context
    ├── utils/
    └── assets/
```

---

## 6. Backend Architecture (NestJS)

```
backend/
├── src/
│   ├── auth/
│   ├── users/
│   ├── memories/
│   ├── categories/
│   ├── tags/
│   ├── locations/
│   ├── ai/
│   ├── search/
│   ├── insights/
│   ├── database/
│   └── common/
├── test/
├── Dockerfile
└── package.json
```

**Layering:** Controller → Service → Repository/Data layer → PostgreSQL.
Business logic stays out of controllers. Use DTOs + `class-validator` everywhere. Use global exception filters and proper HTTP status codes.

---

## 7. Database Design (PostgreSQL, normalized)

**users** — id, name, email (unique), passwordHash, profileImage, createdAt, updatedAt
**memories** — id, userId (FK), title, content, memoryDate, mood, categoryId (FK), locationName, latitude, longitude, createdAt, updatedAt
**categories** — id, name (unique)
**tags** — id, name (unique)
**memory_tags** — memoryId (FK), tagId (FK), composite PK
**memory_images** — id, memoryId (FK), imageUrl
**ai_analysis** — id, memoryId (FK, unique), summary, emotion, keywords, createdAt, updatedAt

**Future-ready:** a `memory_embeddings` table (memoryId FK, `embedding vector(N)`, model name, createdAt) added when reaching Phase 11. Use proper foreign keys with `ON DELETE CASCADE` where appropriate, indexes (userId, memoryDate, categoryId), constraints, and timestamps.

---

## 8. API Design

**Auth**
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`

**Memories**
- `POST /memories`
- `GET /memories`
- `GET /memories/:id`
- `PUT /memories/:id`
- `DELETE /memories/:id`

**Categories** — `GET /categories`, `POST /categories`
**Tags** — `GET /tags`, `POST /tags`
**AI** — `POST /ai/analyze/:memoryId`
**Search** — `GET /search`
**Ask My Diary** — `POST /ask`
**Insights** — `GET /insights`

All memory/search/ask/insights endpoints are JWT-protected and filtered by the authenticated `userId`.

---

## 9. AI Architecture

Keep AI **modular and provider-agnostic**.

```
ai/
├── interfaces/
│   ├── llm-provider.interface.ts
│   └── embedding-provider.interface.ts
├── providers/          # e.g. openai, gemini, anthropic (swappable)
├── ai.service.ts
└── ai.controller.ts
```

### 9.1 Diary analysis
After a memory is created, AI generates: short summary, emotion/mood, keywords, suggested category, important people, important events, location information. Stored in `ai_analysis`.

Example — Input: *"Today I went to Cox's Bazar with my friends. We watched the sunset and spent the evening at the beach."*
Output: Summary "A memorable beach trip to Cox's Bazar with friends." · Category Travel · Mood Happy · Keywords: Cox's Bazar, Friends, Beach, Sunset.

### 9.2 Embedding pipeline
`Diary Content → Embedding API → Vector → PostgreSQL (pgvector)`

### 9.3 RAG pipeline (Ask My Diary)
`Question → Embedding → Semantic search (user's memories only) → Top-K memories → LLM → Answer + source memories`

The LLM must answer **only from the retrieved diary entries**. If nothing relevant is found, say so instead of inventing.

---

## 10. Security Requirements

- JWT authentication, protected routes (guards)
- Password hashing (bcrypt/argon2)
- Input validation on all endpoints
- Authorization + ownership checks on every memory query
- Secrets only via environment variables (`.env`, with `.env.example` committed)
- CORS configured, secure headers
- Safe file upload (type and size limits)
- Proper API error handling (no stack traces to clients)

---

## 11. UI/UX Requirements

Visual identity: **personal, calm, modern, minimal, emotional, premium, easy to use.** It must **not** look like a generic admin dashboard.

- Soft rounded cards, good typography (a serif for diary text is welcome), generous whitespace
- Warm, soft color palette; mood-based accent colors
- Smooth hover effects and subtle animations (don't overdo it)
- Fully responsive: desktop, tablet, mobile
- Light/dark mode if practical
- Loading, empty, and error states everywhere

---

## 12. Development Roadmap and Git Workflow

Build in **this exact order**. Stop and wait for approval after each phase.

| Phase | Scope | Commit message |
|---|---|---|
| 1 | Project setup (monorepo, frontend + backend init, linting, `.gitignore`, `.env.example`) | `feat: initialize frontend` / `feat: initialize backend` |
| 2 | Database design (schema, migrations, seed categories) | `feat: add database schema` |
| 3 | NestJS backend foundation (config, DB module, validation pipe, exception filter) | `feat: add backend foundation` |
| 4 | Authentication (register, login, profile, JWT guard) | `feat: implement authentication` |
| 5 | Diary CRUD (with tags, categories, ownership checks) | `feat: implement memory CRUD` |
| 6 | React frontend (layouts, routing, auth pages, dashboard, editor) | `feat: add react frontend` |
| 7 | Timeline (grouping, filters, search UI) | `feat: add timeline` |
| 8 | Photos and locations | `feat: add photo upload and locations` |
| 9 | Memory Map | `feat: add memory map` |
| 10 | AI analysis | `feat: integrate AI analysis` |
| 11 | Embeddings (pgvector) | `feat: add embeddings` |
| 12 | Semantic search | `feat: implement semantic search` |
| 13 | Ask My Diary / RAG | `feat: implement ask my diary` |
| 14 | Personal Insights | `feat: add personal insights` |
| 15 | Testing | `test: add unit and e2e tests` |
| 16 | Docker | `feat: add docker setup` |
| 17 | Final UI polish | `style: final UI polish` |

Use `fix:` commits for bug fixes (e.g., `fix: authentication validation`). Create a feature branch per phase and merge to `main` after verification.

---

## 13. Docker

- `frontend/Dockerfile`, `backend/Dockerfile`
- PostgreSQL service using a **pgvector-enabled image** (e.g., `pgvector/pgvector:pg16`)
- Root `docker-compose.yml` with healthchecks, volumes for DB and uploads, and env files
- One command to start everything: `docker compose up --build`

---

## 14. Verification Checklist (Browser Agent + Tests)

After each frontend-facing phase, use the Antigravity browser agent in Chrome to check:

- [ ] Page navigation and protected-route redirects
- [ ] Register / Login / Logout
- [ ] Diary create / edit / delete
- [ ] Timeline and filters
- [ ] Search
- [ ] Map markers and popups
- [ ] Responsive layout (desktop, tablet, mobile widths)
- [ ] Error states and loading states
- [ ] No console errors

Backend checks per phase: build passes, unit tests pass, and endpoints verified against the Postman collection. Attach screenshots or recordings to the Walkthrough artifact.

**Security test (required):** create two users; confirm User B gets `404/403` for User A's memory ID on GET, PUT, DELETE, search, and `/ask`.

---

## 15. Postman Collection

Create and keep updated a collection `MemoAI` exported to `docs/postman/memoai.postman_collection.json`:

```
MemoAI
├── Auth
├── Users
├── Memories
├── Categories
├── Tags
├── AI
├── Search
├── Ask My Diary
└── Insights
```

Use collection variables for `baseUrl` and `token`, with a login test script that saves the JWT.

---

## 16. Academic Deliverables

Generate in `docs/` (after the build is stable):

- ER diagram
- Use case diagram
- System architecture diagram
- Database design document
- API documentation
- Testing documentation
- AI architecture and RAG architecture diagrams
- Screenshots of all pages
- README with setup instructions

The project should clearly demonstrate: full-stack development, database management, REST API, authentication, AI integration, semantic search, RAG, map integration, software architecture, testing, Docker.

---

## 17. Final Goal

A user can:

1. Register / Login
2. Write a personal diary
3. Add photos, mood, tags, and location
4. View memories in a beautiful timeline
5. See visited places on a map
6. Let AI analyze diary entries
7. Search memories intelligently
8. Ask questions about personal memories
9. Receive AI-generated personal insights
10. Keep all memories private and secure

---

## ▶ Start Here

**Begin with Phase 1 only.** Do not jump to AI features. Produce the Implementation Plan artifact for Phase 1, wait for approval, build it, verify it, commit it, then report back with a Walkthrough.
