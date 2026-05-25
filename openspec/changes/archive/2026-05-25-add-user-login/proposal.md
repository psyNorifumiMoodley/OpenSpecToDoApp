## Why

Currently all users share the same todo list, making it unsuitable for personal task management. Adding user authentication allows each user to have their own private todo list, making the app genuinely useful as a personal productivity tool.

## What Changes

- A login and registration page will be added to the Angular frontend
- The Spring Boot backend will expose `/api/auth/register` and `/api/auth/login` endpoints
- JWT-based authentication will secure all `/api/todos` endpoints
- The backend will associate each todo with the authenticated user, so only that user's todos are returned
- The Angular app will store the JWT token and attach it to all API requests via an HTTP interceptor
- Unauthenticated users will be redirected to the login page via a route guard

## Capabilities

### New Capabilities
- `user-auth`: Registration and login flow with JWT token issuance, secure storage in the frontend, and a route guard that protects the todo list

### Modified Capabilities
- `todo-management`: Todo items must now be scoped to the authenticated user — the API SHALL only return, create, update, or delete todos that belong to the currently logged-in user

## Impact

- **Backend**: New `User` entity and repository, Spring Security configuration, JWT filter, auth controller, and Flyway migration to add a `users` table and a `user_id` FK on `todos`
- **Frontend**: New login/register components, `AuthService`, JWT interceptor, route guard, and updated environment config
- **Database**: New `users` table; `todos` table gets a non-nullable `user_id` foreign key
- **API**: All `/api/todos` endpoints now require a valid `Authorization: Bearer <token>` header
