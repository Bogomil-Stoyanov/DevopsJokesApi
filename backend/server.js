const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded jokes array
const jokes = [
  {
    id: 1,
    joke: "Why do programmers prefer dark mode? Because light attracts bugs!",
  },
  {
    id: 2,
    joke: "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
  },
  {
    id: 3,
    joke: "Why do Java developers wear glasses? Because they don't C#!",
  },
  { id: 4, joke: "What's a programmer's favorite hangout place? Foo Bar!" },
  {
    id: 5,
    joke: "Why did the developer go broke? Because he used up all his cache!",
  },
  { id: 6, joke: "What do you call a programmer from Finland? Nerdic!" },
  {
    id: 7,
    joke: "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
  },
  {
    id: 8,
    joke: "What's the object-oriented way to become wealthy? Inheritance!",
  },
  {
    id: 9,
    joke: "Why did the Python programmer not respond? Because he was stuck in an infinite loop!",
  },
  {
    id: 10,
    joke: "What do computers and air conditioners have in common? They both become useless when you open Windows!",
  },
];

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Jokes API" });
});

app.get("/api/joke", (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const randomJoke = jokes[randomIndex];
  res.json(randomJoke);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
