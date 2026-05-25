## 1. Database Migration

- [x] 1.1 Create `V2__add_due_date_to_todos.sql` — `ALTER TABLE todos ADD COLUMN due_date DATE`

## 2. Backend — Entity & DTO

- [x] 2.1 Add nullable `LocalDate dueDate` field with getter/setter to `Todo` entity
- [x] 2.2 Add optional `LocalDate dueDate` field to `TodoRequest` record
- [x] 2.3 Add `LocalDate dueDate` field to `TodoResponse` record
- [x] 2.4 Update `TodoMapper` to map `dueDate` between entity and DTOs

## 3. Backend — Service & Controller

- [x] 3.1 Update `TodoService` create/update methods to set `dueDate` from request
- [x] 3.2 Verify `TodoController` passes `dueDate` through without changes (should be automatic via mapper)

## 4. Frontend — Model

- [x] 4.1 Add `dueDate: string | null` to the `Todo` interface in `todo.model.ts`
- [x] 4.2 Add `dueDate: string | null` to the `TodoRequest` interface in `todo.model.ts`

## 5. Frontend — Create Form

- [x] 5.1 Add `MatDatepickerModule` and `MatNativeDateModule` to `TodoFormComponent` imports
- [x] 5.2 Add `dueDate` form control (optional) to the reactive form in `TodoFormComponent`
- [x] 5.3 Add date picker field to the `TodoFormComponent` template
- [x] 5.4 Include `dueDate` (formatted as `YYYY-MM-DD` or `null`) in the emitted `TodoRequest`

## 6. Frontend — Edit Dialog

- [x] 6.1 Add `MatDatepickerModule` and `MatNativeDateModule` to `TodoEditDialogComponent` imports
- [x] 6.2 Add `dueDate` form control pre-populated from the existing todo's `dueDate`
- [x] 6.3 Add date picker field to the edit dialog template
- [x] 6.4 Include `dueDate` in the submitted `TodoRequest` (null if cleared)

## 7. Frontend — Todo Item Display

- [x] 7.1 Add a `dueDateState()` helper in `TodoItemComponent` that returns `'overdue' | 'today' | 'upcoming' | null` based on `todo.dueDate` vs today
- [x] 7.2 Add due date badge to the `TodoItemComponent` template, conditionally rendered when `dueDate` is not null
- [x] 7.3 Style the badge: red for overdue, amber for due today, green for upcoming

## 8. Backend Tests

- [x] 8.1 Update `TodoControllerTest` to include `dueDate` in create/update request/response assertions
- [x] 8.2 Update `TodoServiceTest` to cover `dueDate` mapping in create and update scenarios

## 9. Frontend Tests

- [x] 9.1 Update `TodoFormComponent` spec to assert `dueDate` is included in emitted request
- [x] 9.2 Update `TodoListComponent` spec if needed for new model shape
