/**
 * Integration tests for database migrations and rollbacks
 *
 * Tests the full migration lifecycle:
 * - Apply migrations (up)
 * - Verify data can be inserted and retrieved
 * - Rollback migrations (down)
 * - Verify tables are removed
 *
 * Note: Run with 'npm run test:all' to automatically start PostgreSQL container
 * Or set DB_SKIP_MIGRATION_TESTS=true to skip these tests
 */

const knex = require("knex");
const knexConfig = require("./knexfile");

// Skip migration tests if explicitly disabled (for unit tests only)
const shouldSkip = process.env.DB_SKIP_MIGRATION_TESTS === "true";

if (shouldSkip) {
  describe.skip("Database Migrations", () => {
    it("skipped - run 'npm run test:all' to test with database", () => {});
  });
} else {
  // Use test configuration
  const db = knex(knexConfig.test);

  describe("Database Migrations", () => {
    beforeAll(async () => {
      // Ensure we start with a clean state
      await db.migrate.rollback(null, true);
    });

    afterAll(async () => {
      // Clean up and close connection
      await db.migrate.rollback(null, true);
      await db.destroy();
    });

    describe("Migration Up", () => {
      it("should run migrations successfully", async () => {
        const [batch, log] = await db.migrate.latest();
        expect(batch).toBeGreaterThan(0);
        expect(log).toHaveLength(1);
        expect(log[0]).toContain("create_jokes_table");
      });

      it("should create the jokes table", async () => {
        const hasTable = await db.schema.hasTable("jokes");
        expect(hasTable).toBe(true);
      });

      it("should have correct table structure", async () => {
        const columns = await db.table("jokes").columnInfo();
        expect(columns.id).toBeDefined();
        expect(columns.content).toBeDefined();
        expect(columns.created_at).toBeDefined();
        expect(columns.id.type).toBe("integer");
        expect(columns.content.type).toBe("text");
      });
    });

    describe("Data Operations", () => {
      beforeAll(async () => {
        await db.seed.run();
      });

      it("should insert jokes from seed data", async () => {
        const count = await db("jokes").count("* as count").first();
        expect(parseInt(count.count)).toBeGreaterThan(0);
      });

      it("should retrieve a random joke", async () => {
        const result = await db.raw(
          `SELECT id, content FROM jokes ORDER BY RANDOM() LIMIT 1`
        );
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]).toHaveProperty("id");
        expect(result.rows[0]).toHaveProperty("content");
        expect(typeof result.rows[0].content).toBe("string");
        expect(result.rows[0].content.length).toBeGreaterThan(0);
      });

      it("should have valid joke content", async () => {
        const jokes = await db("jokes").select("*").limit(5);
        jokes.forEach((joke) => {
          expect(joke.id).toBeDefined();
          expect(joke.content).toBeDefined();
          expect(joke.created_at).toBeDefined();
          expect(typeof joke.content).toBe("string");
          expect(joke.content.length).toBeGreaterThan(0);
        });
      });
    });

    describe("Migration Down (Rollback)", () => {
      it("should rollback migrations successfully", async () => {
        const [batch, log] = await db.migrate.rollback();
        expect(batch).toBeGreaterThan(0);
        expect(log).toHaveLength(1);
        expect(log[0]).toContain("create_jokes_table");
      });

      it("should drop the jokes table", async () => {
        const hasTable = await db.schema.hasTable("jokes");
        expect(hasTable).toBe(false);
      });
    });

    describe("Migration Recovery", () => {
      it("should re-apply migrations after rollback", async () => {
        const [batch, log] = await db.migrate.latest();
        expect(batch).toBeGreaterThan(0);
        expect(log).toHaveLength(1);
      });

      it("should verify table exists after re-applying", async () => {
        const hasTable = await db.schema.hasTable("jokes");
        expect(hasTable).toBe(true);
      });

      it("should re-seed data successfully", async () => {
        await db.seed.run();
        const count = await db("jokes").count("* as count").first();
        expect(parseInt(count.count)).toBeGreaterThan(0);
      });
    });
  });
}
