# Write It

Maven multi-module scaffold for an article and book writing platform.

## Modules
- `rest`: Spring Boot 3 REST API for content management features.
- `ui`: React + TypeScript (Vite) frontend managed through Maven using `frontend-maven-plugin`.

## Implemented now (Requirement 2.2 - Content Management)
- Document CRUD (`ARTICLE` and `BOOK`) with `wordCount` and reading-time metrics.
- Book structure APIs for chapters and sections with chapter reorder endpoint.
- Snippet capture API for quick notes.
- Multimedia metadata API (`media_files`) for embedded images/audio/video references.
- Snapshot API for version history (`document_versions`).

## Quick start

### Backend
```bash
mvn -pl rest spring-boot:run
```

### Frontend
```bash
cd ui
npm install
npm run dev
```

## API base
- Backend base URL: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Database profiles
- `local`: H2 in-memory
- `dev`, `uat`, `prod`: PostgreSQL placeholders
