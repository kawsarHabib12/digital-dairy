-- MemoAI Initial Database Schema
-- Compatible with PostgreSQL 15+ and pgvector

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(30),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 3. Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 4. Memories Table
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "memoryDate" DATE NOT NULL,
    mood VARCHAR(50) DEFAULT 'Neutral',
    "categoryId" UUID REFERENCES categories(id) ON DELETE SET NULL,
    "locationName" VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories("userId");
CREATE INDEX IF NOT EXISTS idx_memories_date ON memories("memoryDate");
CREATE INDEX IF NOT EXISTS idx_memories_category_id ON memories("categoryId");

-- 5. Memory Tags Junction Table (Composite PK)
CREATE TABLE IF NOT EXISTS memory_tags (
    "memoryId" UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    "tagId" UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY ("memoryId", "tagId")
);

-- 6. Memory Images Table
CREATE TABLE IF NOT EXISTS memory_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "memoryId" UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_memory_images_memory_id ON memory_images ("memoryId");

-- 7. AI Analysis Table
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "memoryId" UUID UNIQUE NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    summary TEXT,
    emotion VARCHAR(50),
    keywords TEXT,
    "suggestedCategory" VARCHAR(100),
    "peopleMentioned" TEXT,
    "eventsMentioned" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Memory Embeddings Table (pgvector)
CREATE TABLE IF NOT EXISTS memory_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "memoryId" UUID UNIQUE NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    embedding vector(1536),
    "embeddingData" TEXT,
    "modelName" VARCHAR(100) DEFAULT 'text-embedding-3-small',
    dimensions INTEGER DEFAULT 1536,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
