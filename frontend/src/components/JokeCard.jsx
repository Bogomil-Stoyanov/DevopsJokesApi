import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function JokeCard() {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJoke = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/joke`);

      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }

      const data = await response.json();
      setJoke(data.joke);
    } catch (err) {
      setError(
        "Failed to load joke. Please make sure the backend server is running on port 5000."
      );
      console.error("Error fetching joke:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial joke on component mount
  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all hover:scale-105 duration-300">
        {/* Joke Display */}
        <div className="min-h-[150px] flex items-center justify-center mb-8">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">⚠️ Oops!</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <p className="text-2xl md:text-3xl text-gray-800 text-center font-medium leading-relaxed">
              {joke || "Click the button to get a joke!"}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchJoke}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
        >
          {loading ? "Loading..." : "🎲 Get New Joke"}
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Jokes API • DevOps Project</p>
        </div>
      </div>
    </div>
  );
}

export default JokeCard;
