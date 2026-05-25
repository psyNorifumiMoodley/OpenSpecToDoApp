## 1. Project Scaffolding

- [x] 1.1 Initialise the Spring Boot project (Spring Web, Spring Data JPA, PostgreSQL Driver, Flyway, Validation)
- [x] 1.2 Initialise the Angular 17+ project with Angular Material and standalone component defaults
- [x] 1.3 Add a `docker-compose.yml` for a local PostgreSQL instance
- [x] 1.4 Configure `application.properties` with datasource, JPA, and Flyway settings

## 2. Backend — Data Model & Persistence

- [x] 2.1 Create the `Todo` JPA entity with fields: `id`, `title`, `description`, `completed`, `createdAt`, `updatedAt`
- [x] 2.2 Create Flyway migration `V1__create_todos_table.sql` with the `todos` table DDL
- [x] 2.3 Create `TodoRepository` extending `JpaRepository<Todo, Long>`

## 3. Backend — DTOs & Mapper

- [x] 3.1 Create `TodoRequest` Java record (title, description) with Bean Validation annotations (`@NotBlank` on title)
- [x] 3.2 Create `TodoResponse` Java record (id, title, description, completed, createdAt, updatedAt)
- [x] 3.3 Implement a `TodoMapper` utility to convert between `Todo` entity and `TodoResponse`

## 4. Backend — Service & Controller

- [x] 4.1 Implement `TodoService` with methods: `findAll`, `findById`, `create`, `update`, `delete`, `toggleCompleted`
- [x] 4.2 Implement `TodoController` with endpoints: GET `/api/todos`, POST `/api/todos`, GET `/api/todos/{id}`, PUT `/api/todos/{id}`, DELETE `/api/todos/{id}`, PATCH `/api/todos/{id}/toggle`
- [x] 4.3 Add a global `@RestControllerAdvice` exception handler returning 404 for `EntityNotFoundException`
- [x] 4.4 Configure CORS to allow `http://localhost:4200`

## 5. Backend — Tests

- [x] 5.1 Write `@DataJpaTest` for `TodoRepository` (save, find, delete)
- [x] 5.2 Write unit tests for `TodoService` using Mockito
- [x] 5.3 Write `@WebMvcTest` (MockMvc) for `TodoController` covering all endpoints and the 404 case

## 6. Angular — Core Setup

- [x] 6.1 Configure `app.config.ts` to provide `HttpClient` via `provideHttpClient()`
- [x] 6.2 Configure `app.routes.ts` with a default route to the todo list page
- [x] 6.3 Create a `Todo` TypeScript interface matching the `TodoResponse` DTO
- [x] 6.4 Create `TodoService` Angular service with methods: `getAll()`, `create()`, `update()`, `delete()`, `toggle()` using `HttpClient`
- [x] 6.5 Set the API base URL in `environment.ts` (`http://localhost:8080/api`)

## 7. Angular — Components

- [x] 7.1 Create `TodoListComponent` (standalone): fetches todos on init, displays the list, and wires up filter tabs (All / Active / Completed)
- [x] 7.2 Create `TodoItemComponent` (standalone): renders a single todo with a completion checkbox, edit button, and delete button
- [x] 7.3 Create `TodoFormComponent` (standalone): reactive form for creating a new todo (title required, optional description)
- [x] 7.4 Create `TodoEditDialogComponent` (standalone): Angular Material dialog for editing an existing todo's title and description
- [x] 7.5 Wire up empty-state message in `TodoListComponent` when the filtered list is empty

## 8. Angular — State & UX

- [x] 8.1 Use Angular signals in `TodoListComponent` to hold the full todo list and the active filter
- [x] 8.2 Derive the filtered list with `computed()` based on the active filter signal
- [x] 8.3 Refresh the todo list after each create, update, delete, or toggle action
- [x] 8.4 Apply Angular Material theming and basic layout styles (toolbar, card, spacing)

## 9. Angular — Tests

- [x] 9.1 Write a unit test for `TodoService` Angular service (mock `HttpClient`, verify correct URL/method for each method)
- [x] 9.2 Write component tests for `TodoListComponent` and `TodoFormComponent` using Angular Testing Library or `TestBed`

## 10. Integration & Verification

- [x] 10.1 Create DB user/database (`CREATE USER todouser WITH PASSWORD 'todopass'; CREATE DATABASE tododb OWNER todouser;`), run `mvn spring-boot:run` and verify Flyway migration succeeds
- [x] 10.2 Manually test all API endpoints with a REST client (curl or Postman) against http://localhost:8080/api/todos
- [x] 10.3 Start the Angular dev server (`ng serve`) and verify end-to-end: create, list, filter, toggle, edit, delete todos at http://localhost:4200
- [x] 10.4 Verify 404 is returned for requests targeting non-existent todo IDs (e.g. `curl http://localhost:8080/api/todos/999`)
