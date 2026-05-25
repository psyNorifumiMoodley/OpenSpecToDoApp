## Context

The app persists todos in PostgreSQL via Spring Boot (JPA/Flyway) and displays them in an Angular 17 Material frontend. The current `todos` table has no temporal deadline column. The `Todo` entity uses `LocalDateTime` for `createdAt`/`updatedAt`; the `TodoRequest` record contains only `title` and `description`. The Angular `Todo` model mirrors the response shape.

## Goals / Non-Goals

**Goals:**
- Add a nullable `dueDate` field (ISO-8601 date, no time component) to todos
- Persist it via a Flyway migration (no table rebuild)
- Expose it through the existing REST API without breaking existing clients
- Render a visual urgency badge on each todo card: overdue / due today / upcoming

**Non-Goals:**
- Sorting or filtering by due date (future change)
- Reminders or notifications
- Time-zone-aware deadlines (due date is calendar-day only)

## Decisions

### 1. `LocalDate` over `LocalDateTime` for the due date field
A deadline is a calendar day, not a point in time. Using `LocalDate` avoids time-zone complexity and keeps serialization clean (`"2025-12-31"` not `"2025-12-31T00:00:00"`).

*Alternative considered*: `LocalDateTime` with midnight — rejected because it leaks time-zone assumptions and complicates frontend comparison.

### 2. Urgency classification done on the Angular frontend
The frontend compares the `dueDate` string against today's local date using plain JS `Date` arithmetic. No backend endpoint needed.

*Alternative considered*: Backend-computed `urgency` enum field — rejected because it would couple the API to the client's clock/timezone and add unnecessary complexity.

### 3. Angular Material `MatDatepicker` for date input
The app already uses Angular Material throughout. `MatDatepickerModule` + `MatNativeDateModule` fits the existing component style without adding a dependency.

### 4. Flyway migration `V2__add_due_date_to_todos.sql`
A single `ALTER TABLE` adding a nullable column. No data backfill needed — existing rows get `NULL` (no deadline).

### 5. Due date cleared by sending `null` from the frontend
The `TodoRequest` DTO accepts `null` for `dueDate`. The service sets the entity field to `null`, removing the deadline. No dedicated clear endpoint needed.

## Risks / Trade-offs

- **Timezone mismatch**: Urgency is computed using the browser's local date. Users in different timezones may see slightly different urgency states at midnight boundaries. → Acceptable for a single-user local app; document if multi-user support is added.
- **Angular Material date adapter**: `MatNativeDateModule` formats dates using the browser locale. If a custom locale/format is needed later, switching to `MatMomentDateModule` is a minor refactor.

## Migration Plan

1. Deploy backend with `V2__add_due_date_to_todos.sql` — Flyway runs automatically on startup, adds nullable column, existing rows unaffected.
2. Deploy frontend — new `dueDate` field in forms is optional; existing todos show no badge (null due date renders nothing).
3. No rollback complexity — dropping the column is safe since it is nullable and the old frontend ignores unknown fields.
