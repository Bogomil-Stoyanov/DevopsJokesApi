# Testing Guide

This project has two testing modes: unit tests and integration tests.

## Quick Start

### Unit Tests Only (Fast, No Database Required)

```bash
npm test
# or
npm run backend:test
```

**What it does:**

- Runs server unit tests with mocked database
- Skips migration integration tests
- Fast execution (~0.5s)
- No external dependencies

### Full Integration Tests (With Database)

```bash
npm run test:all
# or
npm run backend:test:all
```

**What it does:**

- Automatically starts PostgreSQL container (port 5433)
- Runs all tests including migration tests
- Tests real database operations
- Complete coverage (~1s)

## Test Scripts

### Backend Scripts

```bash
npm run test:unit          # Unit tests only (mocked DB)
npm run test:all           # All tests with auto-started DB container
npm run test:watch         # Watch mode for development

# Database container management
npm run db:test:start      # Start PostgreSQL test container
npm run db:test:stop       # Stop test container
npm run db:test:remove     # Remove test container
```

## Test Container Details

The test setup automatically manages a Docker PostgreSQL container:

- **Container Name:** `jokes-test-db`
- **Image:** `postgres:16-alpine`
- **Port:** `5433` (host) → `5432` (container)
- **Database:** `jokes_db_test`
- **User:** `postgres`
- **Password:** `postgres`

**Features:**

- Container is reused across test runs (fast restarts)
- Automatic health check before running tests
- Port 5433 avoids conflicts with local PostgreSQL

## CI/CD Integration

In GitHub Actions, the pipeline uses service containers instead:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_DB: jokes_db_test
    ports:
      - 5432:5432
```

The `test-setup.js` script is only used for local development.

## Test Structure

### Unit Tests (`server.test.js`)

- Tests API endpoints with mocked database
- Fast execution
- Runs in all environments

### Integration Tests (`migrations.test.js`)

- Tests migration up/down/recovery cycle
- Requires real PostgreSQL database
- Skipped when `DB_SKIP_MIGRATION_TESTS=true`

## Coverage

Current test coverage:

- **server.js:** ~77% (API routes)
- **migrations:** 100% (up/down functions)
- **seeds:** 100% (data insertion)
- **Overall:** ~85%

## Troubleshooting

### Container Won't Start

```bash
# Check if Docker is running
docker ps

# Remove stuck container
npm run db:test:remove

# Try again
npm run test:all
```

### Port 5433 In Use

Edit `backend/test-setup.js` to change `POSTGRES_PORT` to another port.

### Tests Timing Out

Increase timeout in `package.json`:

```json
"test:all": "npm run db:test:start && jest --coverage --testTimeout=20000"
```
