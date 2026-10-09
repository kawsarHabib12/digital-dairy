# MemoAI — Database Design Document

## 1. Overview
The database layer for MemoAI is engineered for high data integrity, strict user privacy boundaries, and vector-enabled semantic search capabilities. It supports dual deployment modes:
- **Production / Containerized**: PostgreSQL 16 with the `pgvector` extension.
- **Local Embedded Development**: SQLite via `better-sqlite3` with identical entity mappings and relational constraints.

---

## 2. Table Specifications

### 2.1 `users` Table
Stores registered user credentials and profile details.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / VARCHAR(36) | PRIMARY KEY | Unique user ID |
| `name` | VARCHAR(100) | NOT NULL | Display name |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | User login email |
| `passwordHash` | VARCHAR(255) | NOT NULL | Salted bcrypt hash |
| `profileImage` | VARCHAR(255) | NULLABLE | Avatar URL |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |

### 2.2 `categories` Table
Standard and custom categorization for memories.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Category identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Category title |
| `color` | VARCHAR(20) | NULLABLE | UI tag badge color |
| `icon` | VARCHAR(50) | NULLABLE | Lucide icon name |

*Default Seed Categories*: Personal, University, Study, Work, Travel, Family, Friends, Achievement, Other.

### 2.3 `tags` Table
Flexible user-defined tagging system.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Tag identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Tag name (case-insensitive) |

### 2.4 `memories` Table (Core Table)
Primary journal and memory records.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Memory identifier |
| `userId` | VARCHAR(36) | NOT NULL, FK(`users.id`) ON DELETE CASCADE | Owner user |
| `title` | VARCHAR(255) | NOT NULL | Memory heading |
| `content` | TEXT | NOT NULL | Full diary entry content |
| `memoryDate` | VARCHAR(20) | NOT NULL | Date memory occurred (YYYY-MM-DD) |
| `mood` | VARCHAR(30) | NOT NULL | Emotional state |
| `categoryId` | VARCHAR(36) | NULLABLE, FK(`categories.id`) | Associated category |
| `locationName` | VARCHAR(255) | NULLABLE | Named place or address |
| `latitude` | FLOAT | NULLABLE | Geo latitude coordinate |
| `longitude` | FLOAT | NULLABLE | Geo longitude coordinate |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 2.5 `memory_images` Table
Multiple image attachments associated with each memory.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Attachment ID |
| `memoryId` | VARCHAR(36) | NOT NULL, FK(`memories.id`) ON DELETE CASCADE | Associated memory |
| `imageUrl` | VARCHAR(500) | NOT NULL | URL or path to media file |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Attachment timestamp |

### 2.6 `memory_tags` Table
Many-to-many junction table between memories and tags.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `memoryId` | VARCHAR(36) | NOT NULL, FK(`memories.id`) ON DELETE CASCADE | Associated memory |
| `tagId` | VARCHAR(36) | NOT NULL, FK(`tags.id`) ON DELETE CASCADE | Associated tag |
*Composite Primary Key: (`memoryId`, `tagId`)*

### 2.7 `ai_analysis` Table
AI extracted sentiment, summaries, and thematic keywords.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Analysis record ID |
| `memoryId` | VARCHAR(36) | NOT NULL, UNIQUE, FK(`memories.id`) ON DELETE CASCADE | One-to-one link to memory |
| `summary` | TEXT | NOT NULL | Concise AI synopsis |
| `emotion` | VARCHAR(50) | NOT NULL | Detected dominant emotion |
| `keywords` | JSON / TEXT | NOT NULL | Extracted thematic keywords |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Generation timestamp |

### 2.8 `memory_embeddings` Table
High-dimensional dense vector embeddings for semantic search & RAG.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | Embedding record ID |
| `memoryId` | VARCHAR(36) | NOT NULL, FK(`memories.id`) ON DELETE CASCADE | Target memory |
| `modelName` | VARCHAR(50) | NOT NULL | Model identifier |
| `embedding` | VECTOR(1536) / JSON | NOT NULL | Dense vector embedding |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

---

## 3. Database Indexing Strategy
- **`idx_memories_user_date`**: Compound index on `(userId, memoryDate DESC)` for near-instant timeline pagination and rendering.
- **`idx_memories_user_category`**: Index on `(userId, categoryId)` for fast category filtering.
- **`idx_memories_user_mood`**: Index on `(userId, mood)` for mood filtering.
- **`idx_memory_embeddings_vector`**: HNSW or IVFFlat vector index on `embedding` using cosine distance operator (`<=>`).
