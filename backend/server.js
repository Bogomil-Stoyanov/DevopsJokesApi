const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Jokes API" });
});

// Get a random joke from the database
app.get("/api/joke", async (req, res) => {
  try {
    // Query for a random joke using PostgreSQL's RANDOM() function
    const result = await db.raw(`
      SELECT id, content as joke 
      FROM jokes 
      ORDER BY RANDOM() 
      LIMIT 1
    `);

    if (result.rows && result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No jokes found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch joke" });
  }
});

app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await db.raw("SELECT 1");
    res.status(200).json({
      status: "OK",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
