-- ATSInfra Database Schema

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parse results table
CREATE TABLE IF NOT EXISTS parse_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    parser VARCHAR(100) NOT NULL,
    success BOOLEAN NOT NULL,
    sections JSONB,
    raw_text TEXT,
    metadata JSONB,
    confidence_scores JSONB,
    issues JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATS simulations table
CREATE TABLE IF NOT EXISTS ats_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    ats_name VARCHAR(100) NOT NULL,
    parse_score FLOAT NOT NULL,
    sections JSONB,
    issues JSONB,
    confidence JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semantic matches table
CREATE TABLE IF NOT EXISTS semantic_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    overall_match FLOAT NOT NULL,
    semantic_score FLOAT NOT NULL,
    literal_score FLOAT NOT NULL,
    matched_skills JSONB,
    missing_capabilities JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume embeddings table (for semantic search)
CREATE TABLE IF NOT EXISTS resume_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    section VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(384),  -- SentenceTransformers dimension
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job description embeddings table
CREATE TABLE IF NOT EXISTS job_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_description TEXT NOT NULL,
    embedding vector(384),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_parse_results_resume_id ON parse_results(resume_id);
CREATE INDEX idx_ats_simulations_resume_id ON ats_simulations(resume_id);
CREATE INDEX idx_semantic_matches_resume_id ON semantic_matches(resume_id);
CREATE INDEX idx_resume_embeddings_resume_id ON resume_embeddings(resume_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);

-- Create vector similarity search index
CREATE INDEX ON resume_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON job_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
