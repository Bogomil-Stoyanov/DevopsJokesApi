const request = require("supertest");

// Mock the database module before requiring server
jest.mock("./db", () => ({
  raw: jest.fn(),
  destroy: jest.fn(),
}));

const db = require("./db");
const app = require("./server");

describe("Jokes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/joke", () => {
    it("should return 200 status code", async () => {
      // Mock successful database response
      db.raw.mockResolvedValueOnce({
        rows: [{ id: 1, joke: "Why do programmers prefer dark mode? Because light attracts bugs!" }]
      });

      const response = await request(app).get("/api/joke");
      expect(response.statusCode).toBe(200);
    });

    it("should return an object with a joke property", async () => {
      db.raw.mockResolvedValueOnce({
        rows: [{ id: 1, joke: "Test joke" }]
      });

      const response = await request(app).get("/api/joke");
      expect(response.body).toHaveProperty("joke");
      expect(typeof response.body.joke).toBe("string");
    });

    it("should return an object with an id property", async () => {
      db.raw.mockResolvedValueOnce({
        rows: [{ id: 42, joke: "Test joke" }]
      });

      const response = await request(app).get("/api/joke");
      expect(response.body).toHaveProperty("id");
      expect(typeof response.body.id).toBe("number");
    });

    it("should return a non-empty joke", async () => {
      db.raw.mockResolvedValueOnce({
        rows: [{ id: 1, joke: "This is a test joke!" }]
      });

      const response = await request(app).get("/api/joke");
      expect(response.body.joke.length).toBeGreaterThan(0);
    });
  });

  describe("GET /health", () => {
    it("should return 200 status code for health check", async () => {
      // Mock successful database health check
      db.raw.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

      const response = await request(app).get("/health");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status", "OK");
    });
  });

  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});
