## Why

Users need to track deadlines for their tasks. Without due dates, the app provides no temporal context, making it harder to prioritize work and identify overdue items at a glance.

## What Changes

- Add an optional `dueDate` field to todo items (null means no deadline)
- Display due date on each todo card with visual urgency states:
  - **Overdue**: due date is in the past
  - **Due today**: due date is today
  - **Upcoming**: due date is in the future
- Allow users to set/clear the due date when creating or editing a todo
- Backend API and database schema updated to persist the `dueDate` field

## Capabilities

### New Capabilities

<!-- none — due date extends the existing todo-management capability -->

### Modified Capabilities

- `todo-management`: Adding optional `dueDate` field to todo creation, editing, listing, and display with urgency-based visual differentiation

## Impact

- **Database**: New nullable `due_date` column on the `todos` table via a Flyway migration
- **Backend API**: `TodoDto` / request bodies gain an optional `dueDate` (ISO-8601 date) field; existing clients unaffected (field is nullable)
- **Frontend**: Todo list item component updated to show due date badge with colour-coded urgency; create/edit form gains a date picker
