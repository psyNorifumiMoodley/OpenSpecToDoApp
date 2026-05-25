## Context

This is a greenfield full-stack Todo application. There is no existing codebase to migrate. The stack is Angular 17+ (frontend), Spring Boot 3.x / Java 17+ (backend), and PostgreSQL (database). The two projects are separate build artifacts — the Angular SPA is served statically or via a dev server, and the Spring Boot app exposes a REST API.

## Goals / Non-Goals

**Goals:**
- Full CRUD REST API for todo items in Spring Boot
- Angular SPA that consumes the REST API via `HttpClient`
- PostgreSQL persistence with Flyway schema migrations
- CORS configured so the Angular dev server (port 4200) can call the API (port 8080)
- Filter todos by status (all / active / completed) on the frontend
- Toggle todo completion status

**Non-Goals:**
- User authentication or multi-tenancy (all todos are global)
- Pagination (scope is a simple list; can be added later)
- Real-time updates (WebSockets / SSE)
- Deployment / containerisation of the Spring Boot app itself

## Decisions

### 1. Angular standalone components (no NgModules)
Angular 17+ defaults to standalone components. This avoids NgModule boilerplate and aligns with the Angular team's recommended path.  
*Alternative considered*: NgModule-based architecture — rejected because it adds ceremony with no benefit for a new project.

### 2. Angular Signals for local state
Use Angular signals (`signal`, `computed`) for the todo list state instead of RxJS BehaviorSubject. Signals are simpler for synchronous UI state and are the Angular team's preferred reactive primitive going forward.  
*Alternative considered*: BehaviorSubject — still used for HTTP observables via `HttpClient`, but not for derived UI state.

### 3. Angular Material for UI components
Angular Material provides accessible, consistent UI primitives (cards, checkboxes, inputs, buttons) without requiring a custom design system.  
*Alternative considered*: TailwindCSS — less integrated with Angular's CDK; deferred for later.

### 4. Spring Boot with Spring Data JPA + Flyway
JPA/Hibernate handles ORM; Flyway manages schema versioning. This is the standard Spring Boot persistence stack and ensures repeatable schema creation across environments.  
*Alternative considered*: JDBC Template — more control but more boilerplate; not necessary for this scope.

### 5. Java Records as DTOs
Use Java records for request/response DTOs (e.g., `TodoRequest`, `TodoResponse`). Records are immutable by default and reduce boilerplate compared to Lombok-annotated classes.  
*Alternative considered*: Lombok `@Data` — heavier tooling dependency; records are now idiomatic Java 17+.

### 6. Hard delete for todo removal
Deleting a todo removes it permanently. Soft delete (an `is_deleted` flag) adds query complexity without clear benefit at this scope.

### 7. CORS configured at the Spring Security / MVC layer
A `@CrossOrigin` annotation on the controller (or a `CorsConfigurationSource` bean) allows `localhost:4200` during development. In production, the allowed origin would be updated to the deployed frontend URL.

### Data Model

```
todos
------
id          BIGSERIAL PRIMARY KEY
title       VARCHAR(255) NOT NULL
description TEXT
completed   BOOLEAN NOT NULL DEFAULT FALSE
created_at  TIMESTAMP NOT NULL DEFAULT NOW()
updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
```

### API Endpoints

| Method | Path             | Description              |
|--------|------------------|--------------------------|
| GET    | /api/todos       | List all todos           |
| POST   | /api/todos       | Create a todo            |
| GET    | /api/todos/{id}  | Get a single todo        |
| PUT    | /api/todos/{id}  | Update a todo            |
| DELETE | /api/todos/{id}  | Delete a todo            |
| PATCH  | /api/todos/{id}/toggle | Toggle completion  |

## Risks / Trade-offs

- **No auth** → All todos are shared/global. Acceptable for a demo/reference app; add auth as a follow-up capability.
- **CORS in dev only** → The allowed-origin config must be updated before any production deployment. Risk is low since this is a dev-first project.
- **Flyway auto-migration on startup** → If a migration script has a bug it will block app startup. Mitigation: test migrations against a local DB before committing.
- **Angular dev proxy not configured** → The frontend calls `localhost:8080` directly. A `proxy.conf.json` can be added later to avoid CORS entirely in dev.