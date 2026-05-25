### Requirement: Create a todo item
The system SHALL allow a user to create a new todo item with a title (required), an optional description, and an optional due date. Newly created todos SHALL have a `completed` status of `false` by default. If no due date is provided, the field SHALL be `null`.

#### Scenario: Successful creation without due date
- **WHEN** the user submits a valid title with no due date via the create form
- **THEN** the system SHALL persist the todo with `dueDate` as `null` and display it in the todo list without a due date badge

#### Scenario: Successful creation with due date
- **WHEN** the user submits a valid title and selects a due date via the date picker
- **THEN** the system SHALL persist the todo with the chosen due date and display it with the appropriate urgency badge

#### Scenario: Missing title
- **WHEN** the user attempts to submit a todo with an empty title
- **THEN** the system SHALL display a validation error and SHALL NOT submit the request

---

### Requirement: List all todo items
The system SHALL display only the todo items belonging to the currently authenticated user, retrieved from the backend, ordered by creation date descending (newest first).

#### Scenario: Todos exist
- **WHEN** the authenticated user loads the application
- **THEN** the system SHALL fetch and display only that user's todos from the API

#### Scenario: No todos exist
- **WHEN** the authenticated user's todo list is empty
- **THEN** the system SHALL display an empty-state message indicating no todos have been created

---

### Requirement: Filter todos by status
The system SHALL allow the user to filter the displayed todo list by status: All, Active (not completed), or Completed.

#### Scenario: Filter active
- **WHEN** the user selects the "Active" filter
- **THEN** the system SHALL display only todos where `completed` is `false`

#### Scenario: Filter completed
- **WHEN** the user selects the "Completed" filter
- **THEN** the system SHALL display only todos where `completed` is `true`

#### Scenario: Filter all
- **WHEN** the user selects the "All" filter
- **THEN** the system SHALL display all todos regardless of status

---

### Requirement: Toggle todo completion
The system SHALL allow a user to toggle the `completed` status of a todo item between `true` and `false`.

#### Scenario: Mark as complete
- **WHEN** the user checks the completion checkbox on an active todo
- **THEN** the system SHALL send a PATCH request to toggle the todo and update the displayed status to completed

#### Scenario: Mark as active
- **WHEN** the user unchecks the completion checkbox on a completed todo
- **THEN** the system SHALL send a PATCH request to toggle the todo and update the displayed status to active

---

### Requirement: Update a todo item
The system SHALL allow a user to edit the title, description, and due date of an existing todo item. Setting the due date field to empty SHALL clear the deadline (set `dueDate` to `null`).

#### Scenario: Successful update with due date change
- **WHEN** the user submits edited content including a new due date for an existing todo
- **THEN** the system SHALL send a PUT request with the updated data and reflect the new due date and urgency badge in the list

#### Scenario: Clearing the due date
- **WHEN** the user clears the date picker and saves the todo
- **THEN** the system SHALL send a PUT request with `dueDate` as `null` and the todo SHALL display no due date badge

#### Scenario: Clear title on update
- **WHEN** the user attempts to save an edit with an empty title
- **THEN** the system SHALL display a validation error and SHALL NOT submit the update

---

### Requirement: Delete a todo item
The system SHALL allow a user to permanently delete a todo item.

#### Scenario: Successful deletion
- **WHEN** the user clicks the delete action for a todo
- **THEN** the system SHALL send a DELETE request and remove the todo from the displayed list

---

### Requirement: Display due date urgency on todo items
The system SHALL display a visual urgency badge on each todo item that has a due date, reflecting the deadline state relative to today's date. Todos with no due date SHALL show no badge.

#### Scenario: Overdue todo
- **WHEN** a todo's due date is before today's date
- **THEN** the system SHALL display an "Overdue" badge styled in red/warn colour

#### Scenario: Due today
- **WHEN** a todo's due date equals today's date
- **THEN** the system SHALL display a "Due today" badge styled in amber/warning colour

#### Scenario: Upcoming todo
- **WHEN** a todo's due date is after today's date
- **THEN** the system SHALL display a "Due <date>" badge styled in green/success colour

#### Scenario: No due date
- **WHEN** a todo has no due date (`dueDate` is `null`)
- **THEN** the system SHALL display no due date badge

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
