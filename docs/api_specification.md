# MemoAI — REST API Specification

**Base URL**: `http://localhost:3001/api` (Local) / `http://localhost:8080/api` (Docker)

All protected routes require an HTTP Authorization header:
`Authorization: Bearer <jwt_access_token>`

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "Password123!"
}
```
- **Success Response (201 Created)**:
```json
{
  "user": {
    "id": "c1f7b029-...",
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "profileImage": null,
    "createdAt": "2026-10-09T06:37:35.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/auth/login`
- **Body**:
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "user": {
    "id": "c1f7b029-...",
    "name": "Alex Mercer",
    "email": "alex@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 1.3 Get Current Profile
- **Method**: `GET`
- **Path**: `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
```json
{
  "id": "c1f7b029-...",
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "profileImage": null
}
```

---

## 2. Memory & Diary Endpoints

### 2.1 Create Memory
- **Method**: `POST`
- **Path**: `/memories`
- **Body**:
```json
{
  "title": "Graduation Ceremony",
  "content": "Today I received my degree with honors in Computer Science.",
  "memoryDate": "2026-06-15",
  "mood": "Proud",
  "categoryName": "University",
  "tags": ["graduation", "milestone", "degree"],
  "locationName": "University Auditorium, Dhaka",
  "latitude": 23.7275,
  "longitude": 90.3888,
  "imageUrls": ["/uploads/img_1234.jpg"]
}
```
- **Success Response (201 Created)**: Returns created Memory entity.

### 2.2 List Memories
- **Method**: `GET`
- **Path**: `/memories`
- **Query Params**:
  - `mood` (optional)
  - `categoryId` (optional)
  - `search` (optional)
  - `startDate` (optional)
  - `endDate` (optional)
- **Success Response (200 OK)**: Array of Memory items with relations.

### 2.3 Get Memory By ID
- **Method**: `GET`
- **Path**: `/memories/:id`
- **Success Response (200 OK)**: Memory details with relations.
- **Error Response (404 Not Found)**: Returned if non-existent or owned by another user.

### 2.4 Update Memory
- **Method**: `PUT`
- **Path**: `/memories/:id`
- **Body**: Partial `CreateMemoryDto`

### 2.5 Delete Memory
- **Method**: `DELETE`
- **Path**: `/memories/:id`
- **Success Response (200 OK)**: `{ "deleted": true, "id": ":id" }`

### 2.6 Upload Image
- **Method**: `POST`
- **Path**: `/memories/upload`
- **Content-Type**: `multipart/form-data` (Field: `file`)
- **Success Response (201 Created)**:
```json
{
  "url": "/uploads/1728456789-photo.jpg",
  "filename": "1728456789-photo.jpg",
  "mimetype": "image/jpeg",
  "size": 1048576
}
```

### 2.7 Visited Locations
- **Method**: `GET`
- **Path**: `/memories/locations`
- **Success Response (200 OK)**: Array of `{ locationName, latitude, longitude, memoryCount, memories }`

---

## 3. AI & Search Endpoints

### 3.1 AI Analyze Memory
- **Method**: `POST`
- **Path**: `/ai/analyze/:memoryId`
- **Success Response (200 OK)**:
```json
{
  "id": "ai-123",
  "memoryId": "mem-1",
  "summary": "Received degree in Computer Science with honors during graduation ceremony.",
  "emotion": "Proud",
  "keywords": ["graduation", "degree", "honors", "university"]
}
```

### 3.2 Semantic / Hybrid Search
- **Method**: `GET`
- **Path**: `/search?q=:query&semantic=true`
- **Success Response (200 OK)**: Array of matching Memory records.

### 3.3 Ask My Diary (RAG QA)
- **Method**: `POST`
- **Path**: `/ask`
- **Body**:
```json
{
  "question": "What did I do during my graduation?"
}
```
- **Success Response (200 OK)**:
```json
{
  "question": "What did I do during my graduation?",
  "answer": "You received your degree with honors in Computer Science at the University Auditorium in Dhaka on June 15, 2026.",
  "sources": [
    {
      "id": "mem-1",
      "title": "Graduation Ceremony",
      "memoryDate": "2026-06-15",
      "mood": "Proud"
    }
  ]
}
```

### 3.4 Personal Insights
- **Method**: `GET`
- **Path**: `/insights`
- **Success Response (200 OK)**:
```json
{
  "totalMemories": 12,
  "uniqueLocations": 4,
  "topMood": "Happy",
  "dominantCategory": "University",
  "moodDistribution": { "Happy": 6, "Proud": 3, "Calm": 3 },
  "categoryDistribution": { "University": 5, "Travel": 4, "Personal": 3 },
  "timelineMonthly": { "2026-10": 7, "2026-06": 5 },
  "aiHighlights": [
    "Your dominant emotional tone is Happy.",
    "You have documented 12 unique life milestones so far."
  ]
}
```
