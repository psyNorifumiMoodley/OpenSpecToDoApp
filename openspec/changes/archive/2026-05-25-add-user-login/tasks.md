## 1. Database Migration

- [x] 1.1 Create Flyway migration `V3__add_users_and_user_id.sql`: create `users` table (`id`, `email`, `password_hash`, `created_at`), delete existing todo rows, add non-nullable `user_id` FK on `todos`

## 2. Backend — User Entity and Repository

- [x] 2.1 Create `User` JPA entity mapped to the `users` table with fields: `id`, `email`, `passwordHash`, `createdAt`
- [x] 2.2 Create `UserRepository` extending `JpaRepository<User, Long>` with `findByEmail(String email)`

## 3. Backend — JWT Utility

- [x] 3.1 Add `io.jsonwebtoken` (jjwt) dependency to `pom.xml`
- [x] 3.2 Create `JwtService` with methods to generate a signed token from a `User` and to validate/extract the subject from an incoming token
- [x] 3.3 Add `jwt.secret` and `jwt.expiration-ms` properties to `application.properties` (read from environment variable `JWT_SECRET`)

## 4. Backend — Spring Security Configuration

- [x] 4.1 Create `SecurityConfig` that disables sessions, permits `/api/auth/**`, and requires authentication on all other `/api/**` endpoints
- [x] 4.2 Create `JwtAuthFilter` (`OncePerRequestFilter`) that extracts the Bearer token, validates it, and sets the `SecurityContext`
- [x] 4.3 Register `JwtAuthFilter` in the security filter chain before `UsernamePasswordAuthenticationFilter`
- [x] 4.4 Configure `BCryptPasswordEncoder` bean and `AuthenticationManager` bean

## 5. Backend — Auth Controller

- [x] 5.1 Create `AuthController` with `POST /api/auth/register` — validate input, check for duplicate email (409), hash password, save user, return JWT
- [x] 5.2 Add `POST /api/auth/login` to `AuthController` — validate credentials, return JWT and email on success (401 on failure)
- [x] 5.3 Create request DTOs (`RegisterRequest`, `LoginRequest`) and response DTO (`AuthResponse` with `token` and `email`)

## 6. Backend — Scope Todos to User

- [x] 6.1 Update `Todo` entity to include a `@ManyToOne` `user` field
- [x] 6.2 Update `TodoRepository` to add `findAllByUserOrderByCreatedAtDesc(User user)` and scope delete/update/get-by-id queries to the authenticated user
- [x] 6.3 Update `TodoService` to accept the authenticated user (resolved from `SecurityContextHolder`) on every CRUD operation
- [x] 6.4 Update `TodoController` to pass the authenticated principal to the service layer

## 7. Angular — Auth Service and Models

- [x] 7.1 Create `AuthService` with `login()`, `register()`, `logout()`, `getToken()`, and `isLoggedIn()` methods; store/retrieve JWT from `localStorage`
- [x] 7.2 Create `LoginRequest`, `RegisterRequest`, and `AuthResponse` TypeScript interfaces matching backend DTOs

## 8. Angular — HTTP Interceptor

- [x] 8.1 Create functional `authInterceptor` that reads the token from `AuthService` and attaches `Authorization: Bearer <token>` to every request

## 9. Angular — Login and Register Components

- [x] 9.1 Create standalone `LoginComponent` at `/login` with a reactive form (email, password), call `AuthService.login()`, navigate to `/todos` on success, show error on 401
- [x] 9.2 Create standalone `RegisterComponent` at `/register` with a reactive form (email, password), call `AuthService.register()`, navigate to `/todos` on success, show error on 409

## 10. Angular — Route Guard and Routing

- [x] 10.1 Create functional `authGuard` that checks `AuthService.isLoggedIn()`; redirect to `/login` if not authenticated
- [x] 10.2 Create functional `noAuthGuard` that redirects authenticated users from `/login` and `/register` to `/todos`
- [x] 10.3 Update `app.routes.ts` to apply guards, add `/login` and `/register` routes, set default redirect

## 11. Angular — Logout UI

- [x] 11.1 Add a logout button to the main todo page header that calls `AuthService.logout()` and navigates to `/login`

## 12. Angular — Provider Registration

- [x] 12.1 Register `authInterceptor` via `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`
