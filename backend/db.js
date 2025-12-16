/**
 * Database connection module using Knex.js
 * Initializes PostgreSQL connection with environment-specific configuration
 */

const knex = require("knex");
const knexConfig = require("./knexfile");

// Determine environment (default to development)
const environment = process.env.NODE_ENV || "development";

// Initialize Knex instance with environment-specific config
const db = knex(knexConfig[environment]);

// Test database connection
db.raw("SELECT 1")
  .then(() => {
    console.log(`✓ Database connected successfully (${environment})`);
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    // Don't exit in production or test environments
    if (environment !== "production" && environment !== "test") {
      process.exit(1);
    }
  });

// Graceful shutdown
process.on("SIGINT", () => {
  db.destroy()
    .then(() => {
      console.log("Database connection closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing database:", err);
      process.exit(1);
    });
});

module.exports = db;
