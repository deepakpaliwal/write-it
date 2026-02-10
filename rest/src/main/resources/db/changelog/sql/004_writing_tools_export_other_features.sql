--liquibase formatted sql

--changeset writeit:004-writing-tools-export-other-features
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags VARCHAR(512);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents(tags);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
