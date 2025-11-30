# Frontend - Jokes API

React frontend application built with Vite and Tailwind CSS that displays random programming jokes.

## Features

- React 18 with Vite for fast development
- Tailwind CSS for styling
- Responsive design
- Loading states and error handling
- Auto-fetch joke on component mount

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will run on `http://localhost:3000`

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000
```

## Note

Make sure the backend server is running on port 5000 before starting the frontend.
