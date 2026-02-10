# Writing Platform Requirements  
Article & Book Writing Application (Spring Boot + React)

## 1. Project Overview

A full-stack web application for writers to create, organize, edit, and publish articles and books (fiction and non-fiction).  
Users collect ideas, write content, arrange structure, verify with AI, add multimedia, perform spell-checking, generate PDFs, and publish to external platforms (Medium, Amazon KDP/digital formats).

**Core Technologies**
- Backend: Spring Boot (Java)
- Frontend: React (with TypeScript recommended)
- Database:
  - Production / Dev / UAT: PostgreSQL
  - Local development: H2 (in-memory)
- Database migrations: Liquibase (SQL-based changelogs)
- Configuration: `application.yml` with multiple active profiles (local, dev, uat, prod)
- Containerization: Docker + docker-compose
- CORS: Properly configured between frontend and backend

## 2. Functional Requirements

### 2.1 User Management
- Register / Login (email + password)
- Optional OAuth (Google, possibly Medium)
- Profile management (name, bio, avatar)
- JWT-based authentication
- Role-based access (USER, ADMIN)

### 2.2 Content Management
- Create/edit/delete **Documents** (Article or Book)
- Rich text editor (Quill, TipTap, Draft.js, or Slate recommended)
- Support formatting: headings, bold, italic, lists, quotes, code blocks, links
- Multimedia embedding:
  - Upload images
  - Embed YouTube/Vimeo videos
  - Embed audio (SoundCloud, self-hosted)
- Idea / Snippet collection (quick notes that can be dragged into documents)
- Document structure:
  - Books: chapters & sections
  - Drag-and-drop reordering
  - Automatic Table of Contents (TOC) generation
- Version history (basic – save snapshots)

### 2.3 Writing Tools
- Spell check (client-side library + optional server-side)
- Word count, reading time estimation
- SEO Suggestions for better search
- AI Verification Chat:
  - Select paragraph/section
  - Send to AI (via API – Grok, OpenAI, Anthropic, etc.)
  - Show suggestions, fact-check, tone, grammar, style feedback
  - Accept / reject changes

### 2.4 Export & Publishing
- Export formats:
  - PDF (with images, basic styling)
  - Markdown
  - HTML
  - EPUB (for books – nice to have)
- Publish to Medium:
  - OAuth integration
  - Post article with title, content, tags, canonical URL
- Publish to Amazon KDP (digital):
  - Generate EPUB or PDF
  - Form to enter metadata (title, description, keywords, categories, cover)
  - Upload preparation (manual upload link or API if available)
- Publish to Write It platform (internal blog hosting):
  - Publish article/book excerpts to public Write It blog
  - Generate SEO-friendly slug URL (`/blog/{slug}`)
  - Maintain publish timestamp and status

### 2.5 Other Features
- Search across user's documents and snippets
- Tags / categories for organizing content
- Dark / light theme support (frontend)
- Responsive design (mobile + desktop)
- Public blog homepage with latest published Write It posts
- Public post detail page (slug-based routing)

## 3. Technical Requirements

### 3.1 Backend (Spring Boot)
- Spring Boot 3.x
- Spring Data JPA + Hibernate
- Spring Security + JWT
- REST API (OpenAPI / Swagger documentation recommended)
- File upload handling (images, audio, etc.) → preferably to cloud storage (S3 / Cloudinary)
- Liquibase for migrations
  - All DDL & DML changes defined in **SQL format**
  - Changesets organized in `src/main/resources/db/changelog`
- Configuration via `application.yml` supporting multiple profiles:
  - local (H2 database, developer-friendly settings)
  - dev
  - uat
  - prod
  - Profile-specific settings for datasource, logging level, liquibase, etc.
- Configuration via `application.yml` with profiles:
  ```yaml
  spring:
    profiles:
      active: local   # default

  ---
  spring:
    config:
      activate:
        on-profile: local
    datasource:
      url: jdbc:h2:mem:writingdb
      driver-class-name: org.h2.Driver
    jpa:
      hibernate:
        ddl-auto: none
    liquibase:
      change-log: classpath:db/changelog/db.changelog-master.yaml

  ---
  spring:
    config:
      activate:
        on-profile: dev
    datasource:
      url: jdbc:postgresql://localhost:5432/writing_dev
  ... similar for uat, prod
  ```

### 3.2 Database
- Main DB: PostgreSQL
- Local: H2
- Important tables (suggested):
  - users
  - documents (title, type: ARTICLE/BOOK, content_json or text, user_id)
  - chapters / sections (for books)
  - media_files (url, type, document_id)
  - document_versions
  - tags / categories

### 3.3 Frontend (React)
- React 18+
- State management: Zustand / Redux Toolkit / Context
- Routing: React Router v6+
- UI library: Material-UI, Chakra UI, Tailwind + Shadcn/ui, or Ant Design
- Rich text editor component
- Drag & drop support (react-beautiful-dnd or dnd-kit)

### 3.4 Deployment & DevOps
- Dockerfile for backend
- Dockerfile for frontend (or serve via Nginx)
- `docker-compose.yml` including:
  - backend service
  - postgres service (with persistent volume)
  - (optional) frontend service
- CORS configuration in Spring Boot (allow frontend origins)

Example minimal CORS configuration (in Java):
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000", "https://yourdomain.com"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```
## 4. Non-Functional Requirements
- Secure file uploads (size limit, content-type validation)
- Rate limiting on AI calls
- Input sanitization (XSS prevention)
- Proper error handling & user-friendly messages
- Basic logging (SLF4J + Logback)
- Performance: handle documents up to ~500 KB raw text comfortably
- Accessibility basics (ARIA labels, keyboard navigation)

## 5. Nice-to-Have / Future Features
- Real-time collaboration
- Export to DOCX
- Grammarly-like inline suggestions
- Cover image generator (AI)
- Publishing preview
- Analytics (writing streaks, most productive time)
