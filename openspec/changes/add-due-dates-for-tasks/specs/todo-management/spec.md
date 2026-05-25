## MODIFIED Requirements

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
The backend SHALL expose a RESTful API under `/api/todos` supporting full CRUD operations and a toggle endpoint. All responses SHALL use JSON. The API SHALL return appropriate HTTP status codes (200, 201, 204, 404). Request and response bodies SHALL include an optional `dueDate` field serialised as an ISO-8601 date string (`YYYY-MM-DD`). Omitting or passing `null` for `dueDate` is valid and stores no deadline.

#### Scenario: Create returns 201
- **WHEN** a valid POST request is made to `/api/todos`
- **THEN** the API SHALL return HTTP 201 with the created todo as JSON, including a `dueDate` field (may be `null`)

#### Scenario: List returns 200
- **WHEN** a GET request is made to `/api/todos`
- **THEN** the API SHALL return HTTP 200 with an array of todo objects each containing a `dueDate` field (may be `null`)

#### Scenario: Not found returns 404
- **WHEN** a request targets a todo ID that does not exist
- **THEN** the API SHALL return HTTP 404

---

### Requirement: Persistent storage in PostgreSQL
The system SHALL persist all todo data in a PostgreSQL database. The schema SHALL be managed by Flyway migrations that run automatically on application startup. The `todos` table SHALL include a nullable `due_date` column of type `DATE`.

#### Scenario: Data survives restart
- **WHEN** the Spring Boot application is restarted
- **THEN** all previously created todos SHALL still be present and queryable, including their `due_date` values

#### Scenario: Schema created on first run
- **WHEN** the application starts against an empty database
- **THEN** Flyway SHALL create the `todos` table automatically including the `due_date` column

#### Scenario: Migration adds column to existing database
- **WHEN** the application starts against a database that has the `todos` table without `due_date`
- **THEN** Flyway SHALL apply migration V2 to add the nullable `due_date` column without data loss
