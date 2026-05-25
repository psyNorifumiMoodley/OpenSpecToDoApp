### Requirement: User registration
The system SHALL allow a new user to register by providing a unique email address and a password. The password SHALL be hashed using BCrypt before storage. Registration SHALL fail if the email is already in use.

#### Scenario: Successful registration
- **WHEN** the user submits a valid, unique email and a non-empty password via the register form
- **THEN** the system SHALL create a new user record, return HTTP 201, and issue a JWT token in the response body

#### Scenario: Duplicate email
- **WHEN** the user attempts to register with an email that already exists in the system
- **THEN** the system SHALL return HTTP 409 and display an error message on the register form

#### Scenario: Missing email or password
- **WHEN** the user submits the register form with an empty email or password
- **THEN** the system SHALL display a validation error and SHALL NOT submit the request

---

### Requirement: User login
The system SHALL allow a registered user to log in by providing their email and password. On success, the system SHALL issue a signed JWT token with a 24-hour expiry.

#### Scenario: Successful login
- **WHEN** the user submits a valid email and matching password via the login form
- **THEN** the system SHALL return HTTP 200 with a JWT token and the user's email in the response body

#### Scenario: Invalid credentials
- **WHEN** the user submits an email that does not exist or a wrong password
- **THEN** the system SHALL return HTTP 401 and display an "Invalid credentials" error on the login form

#### Scenario: Missing fields
- **WHEN** the user submits the login form with an empty email or password
- **THEN** the system SHALL display a validation error and SHALL NOT submit the request

---

### Requirement: JWT token storage and attachment
The Angular frontend SHALL store the JWT token in `localStorage` after a successful login or registration. The `AuthInterceptor` SHALL attach the token as an `Authorization: Bearer <token>` header to every outgoing HTTP request to `/api/**`.

#### Scenario: Token attached to API requests
- **WHEN** the user is logged in and the frontend makes any request to `/api/todos`
- **THEN** the request SHALL include a valid `Authorization: Bearer <token>` header

#### Scenario: No token stored
- **WHEN** no JWT is present in `localStorage`
- **THEN** the interceptor SHALL send the request without an Authorization header (the backend will reject it with 401)

---

### Requirement: Route guard protecting the todo list
The Angular application SHALL redirect unauthenticated users to `/login` when they attempt to access the `/todos` route. Authenticated users SHALL be redirected from `/login` to `/todos`.

#### Scenario: Unauthenticated access to todos
- **WHEN** an unauthenticated user navigates to `/todos`
- **THEN** the system SHALL redirect them to `/login`

#### Scenario: Authenticated user visits login
- **WHEN** a user with a valid stored token navigates to `/login`
- **THEN** the system SHALL redirect them to `/todos`

---

### Requirement: Logout
The system SHALL allow a logged-in user to log out. Logging out SHALL remove the JWT token from `localStorage` and redirect the user to `/login`.

#### Scenario: Successful logout
- **WHEN** the user clicks the logout button
- **THEN** the system SHALL clear the stored token and navigate to the login page

---

### Requirement: Backend auth endpoints
The backend SHALL expose `/api/auth/register` (POST) and `/api/auth/login` (POST) endpoints. These endpoints SHALL be publicly accessible (no authentication required). All other `/api/**` endpoints SHALL require a valid JWT.

#### Scenario: Unauthenticated request to protected endpoint
- **WHEN** a request to `/api/todos` is made without a valid Authorization header
- **THEN** the backend SHALL return HTTP 401

#### Scenario: Authenticated request proceeds
- **WHEN** a request to `/api/todos` includes a valid `Authorization: Bearer <token>` header
- **THEN** the backend SHALL process the request and return the appropriate response
