# Backend - Jokes API

Express.js backend that serves random programming jokes.

## Features

- RESTful API endpoint for random jokes
- CORS enabled
- Unit tests with Jest and Supertest
- Health check endpoint

## API Endpoints

- `GET /api/joke` - Returns a random joke
- `GET /health` - Health check endpoint
- `GET /` - Welcome message

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Response Format

```json
{
  "id": 1,
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs!"
}
```
