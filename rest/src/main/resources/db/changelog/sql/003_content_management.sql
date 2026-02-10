--liquibase formatted sql

--changeset writeit:003-content-management
ALTER TABLE documents ADD COLUMN IF NOT EXISTS word_count INT NOT NULL DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reading_time_minutes INT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS chapters (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    CONSTRAINT fk_chapters_documents FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sections (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    position INT NOT NULL,
    CONSTRAINT fk_sections_chapters FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS snippets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT fk_snippets_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media_files (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    type VARCHAR(40) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    CONSTRAINT fk_media_documents FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_versions (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    version_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_versions_documents FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT uq_document_version UNIQUE (document_id, version_number)
);
