import { useState } from "react";
import JokeCard from "./components/JokeCard";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            😂 Jokes API
          </h1>
          <p className="text-xl text-white drop-shadow-md">
            DevOps Project - Programming Humor
          </p>
        </header>
        <JokeCard />
      </div>
    </div>
  );
}

export default App;
