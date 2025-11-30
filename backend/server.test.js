const request = require("supertest");
const app = require("./server");

describe("Jokes API", () => {
  describe("GET /api/joke", () => {
    it("should return 200 status code", async () => {
      const response = await request(app).get("/api/joke");
      expect(response.statusCode).toBe(200);
    });

    it("should return an object with a joke property", async () => {
      const response = await request(app).get("/api/joke");
      expect(response.body).toHaveProperty("joke");
      expect(typeof response.body.joke).toBe("string");
    });

    it("should return an object with an id property", async () => {
      const response = await request(app).get("/api/joke");
      expect(response.body).toHaveProperty("id");
      expect(typeof response.body.id).toBe("number");
    });

    it("should return a non-empty joke", async () => {
      const response = await request(app).get("/api/joke");
      expect(response.body.joke.length).toBeGreaterThan(0);
    });
  });

  describe("GET /health", () => {
    it("should return 200 status code for health check", async () => {
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
