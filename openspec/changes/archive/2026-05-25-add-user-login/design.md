## Context

The app currently has no concept of users — all todos are stored globally. The backend is a Spring Boot 3.x application with a PostgreSQL database managed by Flyway. The frontend is Angular 17+ with standalone components calling the REST API. Adding authentication requires changes at every layer: database schema, backend security, API scoping, and frontend routing/HTTP handling.

## Goals / Non-Goals

**Goals:**
- Allow users to self-register and log in with an email and password
- Issue JWT tokens on login that the frontend uses for all subsequent requests
- Scope all todo CRUD operations to the authenticated user
- Protect the Angular todo route with an auth guard; redirect unauthenticated users to `/login`

**Non-Goals:**
- OAuth / social login (Google, GitHub, etc.)
- Password reset or email verification
- Role-based access control
- Remembering sessions across browser restarts (tokens are session-scoped in memory or localStorage — see decision below)

## Decisions

### 1. JWT over session cookies
**Decision**: Stateless JWT tokens stored in `localStorage`.  
**Rationale**: The frontend and backend are separate origins during development (Angular dev server vs Spring Boot). JWT avoids CORS cookie complexity and fits the existing fetch-based API client pattern. `localStorage` is straightforward; `httpOnly` cookies would require additional CORS + CSRF configuration.  
**Alternative considered**: Session cookies with `httpOnly` — more secure against XSS but adds meaningful CORS/CSRF complexity for this app's scope.

### 2. Spring Security with a custom JWT filter
**Decision**: Use Spring Security 6 with a `OncePerRequestFilter` that validates the `Authorization: Bearer <token>` header on every request to `/api/todos/**`.  
**Rationale**: Spring Security is already a natural fit for Spring Boot 3. A stateless filter chain (no sessions) keeps the design simple and horizontally scalable.  
**Alternative considered**: Manual filter without Spring Security — more brittle and loses access to `SecurityContextHolder` integration.

### 3. Password hashing with BCrypt
**Decision**: Use `BCryptPasswordEncoder` (Spring Security built-in).  
**Rationale**: Industry-standard, built into Spring Security, no extra dependency. Salt is embedded in the hash.

### 4. User-scoped todos via `user_id` FK
**Decision**: Add a non-nullable `user_id` foreign key on the `todos` table. All repository queries will filter by the authenticated user's ID extracted from the JWT.  
**Rationale**: Simplest data model; no multi-tenancy complexity needed. Each query naturally scopes to the caller.  
**Migration note**: Existing rows have no owner — the Flyway migration will add the column as nullable initially, then a follow-up step can delete legacy rows or assign them to a seed user (see Migration Plan).

### 5. Angular route guard + HTTP interceptor
**Decision**: A functional `authGuard` protects `/todos`. An `AuthInterceptor` (functional `HttpInterceptorFn`) attaches the Bearer token to every request. `AuthService` manages token storage and expiry check.  
**Rationale**: Standalone Angular 17 pattern; no need for class-based guards or interceptors.

## Risks / Trade-offs

- **`localStorage` XSS exposure** → Acceptable for a learning/demo app; note in README that production use should evaluate `httpOnly` cookies.
- **Existing todos become orphaned** → Migration will delete existing rows before adding the FK constraint (no real user data exists yet).
- **JWT secret in `application.properties`** → Use an environment variable (`JWT_SECRET`) so it is not committed to source control.
- **Token expiry not refreshed** → Expired tokens redirect to login. No silent refresh implemented (Non-Goal).

## Migration Plan

1. Add Flyway migration `V3__add_users_and_user_id.sql`:
   - Create `users` table (`id`, `email`, `password_hash`, `created_at`)
   - Delete all rows from `todos` (no real data yet)
   - Add non-nullable `user_id` FK on `todos` referencing `users(id)`
2. Deploy backend with Spring Security config, JWT filter, and auth endpoints
3. Deploy updated Angular frontend with login/register pages, guard, and interceptor

**Rollback**: Drop the `user_id` column and `users` table (V4 migration); remove Spring Security config; redeploy both services.

## Open Questions

- Should the JWT expiry be configurable via `application.properties`? (Default: 24 hours)
- Should the register endpoint return a JWT immediately (auto-login after register) or require a separate login step?
