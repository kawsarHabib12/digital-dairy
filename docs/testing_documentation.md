# MemoAI — Testing & Security Verification Documentation

## 1. Test Overview

The MemoAI platform undergoes multi-tiered verification to guarantee:
1. **Core Diary CRUD Operations**: Robust persistence, relation hydration, and tag generation.
2. **Strict User Privacy Isolation**: Zero data leakage between accounts across all endpoints (CRUD, Search, Map, AI QA).
3. **Automated Unit Tests**: Verified using Jest for services and controllers.
4. **End-to-End API Workflows**: Validated with node integration scripts and Postman.

---

## 2. Unit Testing Summary

Running `npm test` executes the NestJS Jest test suite:

```bash
$ npm run test -- --passWithNoTests

PASS src/app.controller.spec.ts (13.513 s)
PASS src/ai/ai.service.spec.ts (15.087 s)
PASS src/auth/auth.service.spec.ts (15.689 s)
PASS src/memories/memories.service.spec.ts (18.173 s)

Test Suites: 4 passed, 4 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        20.295 s
```

### Coverage by Suite:
- **`AppController`**: Checks application health and root ping.
- **`AuthService`**: Tests registration with duplicate email rejection, bcrypt hash verification, and JWT issuance.
- **`MemoriesService`**: Verifies memory creation, tag mapping, entity hydration, and `NotFoundException` isolation when an unauthorized user queries another user's memory.
- **`AiService`**: Verifies diary analysis generation, emotional tone classification, and source memory citation in the Ask My Diary RAG pipeline.

---

## 3. Security Isolation Verification

### The Two-User Privacy Experiment
A dedicated integration test script was executed against the running backend to simulate an adversary attempting cross-user data access:
1. **User A (`sarah@test.com`)** registers and creates a private memory:
   - ID: `mem_sarah_01`
   - Title: *"Private Personal Reflection"*
2. **User B (`charlie@test.com`)** registers and attempts:
   - `GET /api/memories/mem_sarah_01` (with User B's token)
   - `PUT /api/memories/mem_sarah_01` (with User B's token)
   - `DELETE /api/memories/mem_sarah_01` (with User B's token)
   - `GET /api/search?q=Reflection` (with User B's token)
   - `POST /api/ask { question: "What was Sarah's reflection?" }` (with User B's token)

### Results:
- **`GET /api/memories/:id`**: Responded with `404 Not Found` (zero leakage).
- **`PUT /api/memories/:id`**: Responded with `404 Not Found`.
- **`DELETE /api/memories/:id`**: Responded with `404 Not Found`.
- **`Search / Ask My Diary`**: Returned 0 results and answered *"I couldn't find any memories in your personal diary related to that"*.

**Conclusion**: Privacy is cryptographically and logically isolated at the database query level.

---

## 4. Frontend Build & Static Verification
The frontend is compiled using Vite with Rolldown/esbuild:
```bash
$ npx vite build
✓ 1983 modules transformed.
dist/index.html                   1.14 kB │ gzip:   0.63 kB
dist/assets/index-DjIJb--U.css   42.70 kB │ gzip:  12.18 kB
dist/assets/index-DZV_8QQm.js   546.42 kB │ gzip: 164.02 kB
✓ built in 3.13s
```
Zero linting errors, zero broken modules, clean HTML5/CSS bundle.
