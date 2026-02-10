--liquibase formatted sql

--changeset writeit:005-write-it-blog-publishing
ALTER TABLE documents ADD COLUMN IF NOT EXISTS published_to_write_it BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS write_it_slug VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_documents_published_to_write_it ON documents(published_to_write_it);
CREATE INDEX IF NOT EXISTS idx_documents_write_it_slug ON documents(write_it_slug);
