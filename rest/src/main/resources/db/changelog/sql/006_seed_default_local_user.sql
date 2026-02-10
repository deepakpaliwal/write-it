--liquibase formatted sql

--changeset writeit:006-seed-default-local-user
INSERT INTO users (id, email, password_hash, role, display_name, bio, avatar_url, created_at, updated_at)
SELECT 1, 'demo@writeit.app', 'local-dev-placeholder', 'USER', 'Demo Writer', 'Local seeded user for development', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);
