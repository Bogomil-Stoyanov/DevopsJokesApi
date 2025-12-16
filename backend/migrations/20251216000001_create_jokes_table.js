/**
 * Migration: Create jokes table
 *
 * Up: Creates the jokes table with id, content, and created_at fields
 * Down: Drops the jokes table
 */

exports.up = function (knex) {
  return knex.schema.createTable("jokes", function (table) {
    // Primary key with auto-increment
    table.increments("id").primary();

    // Joke content - text field, required
    table.text("content").notNullable();

    // Timestamp - defaults to current timestamp
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Optional: Add indexes for performance
    table.index("created_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("jokes");
};
