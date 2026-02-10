# Write It

Maven multi-module scaffold for an article and book writing platform.

## Modules
- `rest`: Spring Boot 3 REST API with baseline security, OpenAPI, JPA, and Liquibase migrations.
- `ui`: React + TypeScript (Vite) frontend managed through Maven using `frontend-maven-plugin`.

## Quick start

### Build all modules
```bash
mvn clean verify
```

### Run backend (local profile)
```bash
mvn -pl rest spring-boot:run
```

### Run frontend
```bash
cd ui
npm install
npm run dev
```

## Backend profiles
- `local`: H2 in-memory DB
- `dev`, `uat`, `prod`: PostgreSQL datasource placeholders

Liquibase changelog master:
- `rest/src/main/resources/db/changelog/db.changelog-master.yaml`
