## MODIFIED Requirements

### Requirement: List all todo items
The system SHALL display only the todo items belonging to the currently authenticated user, retrieved from the backend, ordered by creation date descending (newest first).

#### Scenario: Todos exist
- **WHEN** the authenticated user loads the application
- **THEN** the system SHALL fetch and display only that user's todos from the API

#### Scenario: No todos exist
- **WHEN** the authenticated user's todo list is empty
- **THEN** the system SHALL display an empty-state message indicating no todos have been created

---

### Requirement: Backend REST API for todos
The backend SHALL expose a RESTful API under `/api/todos` supporting full CRUD operations and a toggle endpoint. All responses SHALL use JSON. The API SHALL require a valid `Authorization: Bearer <token>` header on every request. The API SHALL return appropriate HTTP status codes (200, 201, 204, 401, 404). Request and response bodies SHALL include an optional `dueDate` field serialised as an ISO-8601 date string (`YYYY-MM-DD`). All operations SHALL be scoped to the authenticated user — a user SHALL NOT be able to read, modify, or delete another user's todos.

#### Scenario: Create returns 201
- **WHEN** a valid authenticated POST request is made to `/api/todos`
- **THEN** the API SHALL return HTTP 201 with the created todo as JSON, associated with the requesting user

#### Scenario: List returns only caller's todos
- **WHEN** an authenticated GET request is made to `/api/todos`
- **THEN** the API SHALL return HTTP 200 with an array of todo objects belonging exclusively to the requesting user

#### Scenario: Not found returns 404
- **WHEN** a request targets a todo ID that does not exist or belongs to another user
- **THEN** the API SHALL return HTTP 404

#### Scenario: Unauthenticated request returns 401
- **WHEN** a request to `/api/todos` is made without a valid Authorization header
- **THEN** the API SHALL return HTTP 401

---

### Requirement: Persistent storage in PostgreSQL
The system SHALL persist all todo data in a PostgreSQL database. The schema SHALL be managed by Flyway migrations that run automatically on application startup. The `todos` table SHALL include a nullable `due_date` column of type `DATE` and a non-nullable `user_id` foreign key referencing the `users` table.

#### Scenario: Data survives restart
- **WHEN** the Spring Boot application is restarted
- **THEN** all previously created todos SHALL still be present and queryable, including their `due_date` and `user_id` values

#### Scenario: Schema created on first run
- **WHEN** the application starts against an empty database
- **THEN** Flyway SHALL create the `users` table and the `todos` table with `due_date` and `user_id` columns automatically

#### Scenario: Migration updates existing database
- **WHEN** the application starts against a database with the existing `todos` schema but no `users` table or `user_id` column
- **THEN** Flyway SHALL apply migration V3 to create the `users` table, delete orphaned todo rows, and add the non-nullable `user_id` FK without data loss for any user-owned todos
