# Delta for Backend Database

## ADDED Requirements

### Requirement: PostgreSQL Connection

The system MUST establish a connection to PostgreSQL on server startup using environment variables.

#### Scenario: Successful DB connection

- GIVEN PostgreSQL is running on localhost:5432 with valid credentials
- WHEN the backend server starts
- THEN the server MUST log "Database connected successfully"
- AND the /health endpoint MUST return "db: connected" in status

#### Scenario: PostgreSQL unavailable

- GIVEN PostgreSQL is not running or credentials are invalid
- WHEN the backend server starts
- THEN the server MUST throw "Connection refused" error
- AND the server MUST NOT start

### Requirement: User Model Persistence

The system MUST persist user data to the `users` table in PostgreSQL.

#### Scenario: User registration

- GIVEN a new user with name, email, phone, and password
- WHEN POST /api/auth/register is called
- THEN the user MUST be saved to the `users` table
- AND the returned user object MUST include an auto-generated UUID

#### Scenario: User login with persisted credentials

- GIVEN a previously registered user exists in the database
- WHEN POST /api/auth/login is called with valid credentials
- THEN the system MUST return a valid JWT token
- AND the user data MUST be fetched from PostgreSQL

### Requirement: Product Model Persistence

The system MUST persist product data to the `products` table in PostgreSQL.

#### Scenario: Fetch all products

- GIVEN multiple products exist in the database
- WHEN GET /api/products is called
- THEN the response MUST include products from PostgreSQL
- AND the response format MUST match the current API contract

#### Scenario: Create new product

- GIVEN product data (name, price, category, etc.)
- WHEN POST /api/products (if implemented) is called
- THEN the product MUST be saved with auto-generated ID
- AND createdAt/updatedAt timestamps MUST be set automatically

### Requirement: System Config Storage

The system MUST store application configuration in the `system_config` table.

#### Scenario: Read system config

- GIVEN system_config table contains app_name, version, release_date
- WHEN GET /health or GET /api/config is called
- THEN the response MUST include current config values from DB

#### Scenario: Initialize default config

- GIVEN system_config table is empty on first startup
- THEN the system MUST automatically insert default values:
  - app_name: "MODACOLOMBIA"
  - version: "1.0.0"
  - release_date: "2026-01-01"
  - description: "Tienda de moda colombiana"

## MODIFIED Requirements

### Requirement: Model Interface Compatibility

The existing static methods (findAll, findById, create, update, delete) MUST remain functional after migration.
(Previously: Methods worked with in-memory Map)

- GIVEN any existing API call that uses Product.findAll()
- WHEN the request is made
- THEN the response MUST be identical to the in-memory version
- AND no changes to controllers or routes are required

### Requirement: Environment Configuration

The system MUST read database credentials from .env file.
(Previously: No database config existed)

#### Scenario: Missing .env variables

- GIVEN the .env file does not contain DB_HOST, DB_NAME, DB_USER, or DB_PASSWORD
- THEN the server MUST fail to start with clear error message
- AND the error MUST indicate which env variables are missing

## REMOVED Requirements

### Requirement: In-Memory Storage

The in-memory Map storage for users and products is REMOVED.
(Reason: Replaced by PostgreSQL for data persistence)

- The users Map and products Map MUST NOT be used for data storage
- Data MUST only exist in PostgreSQL tables