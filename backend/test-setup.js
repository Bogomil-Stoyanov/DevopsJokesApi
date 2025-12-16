/**
 * Test setup script
 * Starts PostgreSQL container for testing if not already running
 */

const { execSync } = require("child_process");

const CONTAINER_NAME = "jokes-test-db";
const POSTGRES_PORT = 5433;
const POSTGRES_PASSWORD = "postgres";

function execute(command, ignoreError = false) {
  try {
    return execSync(command, { encoding: "utf-8", stdio: "pipe" });
  } catch (error) {
    if (!ignoreError) {
      throw error;
    }
    return null;
  }
}

function isContainerRunning() {
  const result = execute(
    `docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
    true
  );
  return result && result.trim() === CONTAINER_NAME;
}

function isContainerStopped() {
  const result = execute(
    `docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
    true
  );
  return result && result.trim() === CONTAINER_NAME;
}

function startContainer() {
  console.log("Starting PostgreSQL test container...");

  if (isContainerRunning()) {
    console.log("✅ PostgreSQL container already running");
    return true;
  }

  if (isContainerStopped()) {
    console.log("Starting existing container...");
    execute(`docker start ${CONTAINER_NAME}`);
  } else {
    console.log("Creating new PostgreSQL container...");
    execute(`docker run -d \
      --name ${CONTAINER_NAME} \
      -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
      -e POSTGRES_DB=jokes_db_test \
      -p ${POSTGRES_PORT}:5432 \
      postgres:16-alpine`);
  }

  // Wait for PostgreSQL to be ready
  console.log("Waiting for PostgreSQL to be ready...");
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const result = execute(
        `docker exec ${CONTAINER_NAME} pg_isready -U postgres`,
        true
      );
      if (result && result.includes("accepting connections")) {
        console.log("✅ PostgreSQL is ready!");
        return true;
      }
    } catch (error) {
      // Continue waiting
    }
    attempts++;
    // Sleep for 1 second
    execSync("sleep 1");
  }

  console.error("❌ PostgreSQL failed to start in time");
  return false;
}

function stopContainer() {
  if (isContainerRunning()) {
    console.log("🛑 Stopping PostgreSQL test container...");
    execute(`docker stop ${CONTAINER_NAME}`, true);
  }
}

function removeContainer() {
  if (isContainerStopped()) {
    console.log("Removing PostgreSQL test container...");
    execute(`docker rm ${CONTAINER_NAME}`, true);
  }
}

// Handle script arguments
const args = process.argv.slice(2);

if (args.includes("--start")) {
  process.exit(startContainer() ? 0 : 1);
} else if (args.includes("--stop")) {
  stopContainer();
  process.exit(0);
} else if (args.includes("--remove")) {
  stopContainer();
  removeContainer();
  process.exit(0);
} else {
  // Default: start for tests
  process.exit(startContainer() ? 0 : 1);
}
