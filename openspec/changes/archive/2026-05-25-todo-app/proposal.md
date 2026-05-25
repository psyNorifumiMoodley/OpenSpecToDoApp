## Why

Teams and individuals need a simple, reliable way to track tasks and stay organized. This Todo app provides a full-stack reference implementation using Angular, Spring Boot, and PostgreSQL — demonstrating modern web development practices with a persistent, production-ready backend.

## What Changes

- New Angular 17+ frontend SPA for creating, viewing, updating, and deleting todos
- New Spring Boot 3.x REST API backend with full CRUD endpoints for todo items
- PostgreSQL database schema for persistent todo storage
- Dockerised PostgreSQL for local development

## Capabilities

### New Capabilities

- `todo-management`: Full CRUD lifecycle for todo items — create, list, update (title/description/status), delete, and toggle completion. Includes filtering by status (all, active, completed) and basic sorting.

### Modified Capabilities

<!-- None — this is a greenfield project -->

## Impact

- **Frontend**: New Angular project with components, services, and HTTP client integration
- **Backend**: New Spring Boot project with REST controllers, JPA entities, repositories, and service layer
- **Database**: New PostgreSQL schema with a `todos` table
- **Dependencies**: Angular 17+, Angular Material, Spring Boot 3.x, Spring Data JPA, PostgreSQL driver, Flyway migrations