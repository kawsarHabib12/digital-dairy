# MemoAI — AI-Powered Digital Diary

[![NestJS](https://img.shields.io/badge/backend-NestJS%2010-E0234E?logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styles-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)](https://www.docker.com/)

> **"Your memories. Your story. One intelligent diary."**
> A personal digital diary that remembers with you.

MemoAI is a full-stack, university-grade software engineering project designed to help people record, understand, and rediscover their life moments through modern web design, privacy-first architecture, and intelligent semantic AI assistance.

---

## 🌟 Key Features

1. **Digital Diary Editor**:
   - Paper-like personal writing canvas with mood tracking, categories, tags, location selection, and photo attachments.
2. **Interactive Timeline**:
   - Beautiful chronological stream grouped by month and date with multi-dimensional filtering (category, mood, search).
3. **Interactive Memory Map**:
   - OpenStreetMap + Leaflet integration displaying geo-tagged memory markers with entry counters and popup cards.
4. **AI Diary Analysis**:
   - Automatic sentiment detection, concise synopsis generation, and thematic keyword extraction.
5. **Ask My Diary (RAG QA)**:
   - Chat-like interface enabling users to query their past experiences in natural language with direct source memory citations.
6. **Personal Insights**:
   - Emotional health analytics, monthly writing volume, top categories, and AI-driven growth highlights.
7. **Strict Privacy Isolation**:
   - Complete data separation at the database query level; memories are strictly private to each authenticated user.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Leaflet.js |
| **Backend** | NestJS 10, TypeScript, TypeORM, Multer, Passport JWT, bcryptjs |
| **Database** | PostgreSQL 16 + pgvector (Production/Docker) / SQLite (Local Dev) |
| **AI Layer** | Modular AI Architecture (Gemini 1.5 Pro / Flash & Mock Fallback) |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles, Nginx SPA Proxy |

---

## 🚀 Quick Start

### Option A: Running with Docker Compose (Recommended for Production)

Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed.

```bash
# Clone and enter the repository
cd "memoai"

# Launch all services (PostgreSQL + pgvector, NestJS Backend, React Frontend)
docker compose up --build
```

- **Frontend App**: [http://localhost:8080](http://localhost:8080)
- **Backend REST API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Database**: `localhost:5432` (`memoai_db`)

---

### Option B: Running Locally (Development Mode)

#### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm run start:dev
```
The backend starts at `http://localhost:3001/api`.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at `http://localhost:5174` (or `http://localhost:5173`).

---

## 🧪 Testing

To run the automated NestJS test suite:
```bash
cd backend
npm test
```
All 4 test suites (`AuthService`, `MemoriesService`, `AiService`, `AppController`) will run and validate authentication, privacy isolation, and AI pipelines.

---

## 📚 Project Documentation

Detailed academic deliverables and architectural guides are available in the `docs/` folder:
- [System Architecture & ER Diagram](docs/architecture.md)
- [Database Design Document](docs/database_design.md)
- [REST API Specification](docs/api_specification.md)
- [Testing & Privacy Verification](docs/testing_documentation.md)
- [Postman Collection](docs/postman/memoai.postman_collection.json)

---

## 🔒 Security & Privacy

MemoAI enforces strict data governance:
- All memory queries enforce user ownership (`userId`).
- Unauthorized requests to memory IDs return HTTP `404 Not Found` (zero data leakage).
- All AI queries and RAG embeddings are strictly isolated to the authenticated user's records.
- File uploads are validated for safe image MIME types and restricted to 5MB.

---

## 📄 License
MIT License. Created for University Full-Stack Software Engineering Demonstration.
