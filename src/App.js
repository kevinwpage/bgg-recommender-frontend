import { useState } from "react";

export default function App() {
  const [favorites, setFavorites] = useState(["", "", "", "", ""]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...favorites];
    updated[index] = value;
    setFavorites(updated);
  };

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const response = await fetch("/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: favorites.filter((f) => f.trim()) }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        setError("No recommendations found. Please try different games.");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.message || "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        🎲 Eerily Accurate Board Game Recommender
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Enter up to 5 of your favorite games
      </p>
      <div className="max-w-md mx-auto space-y-3">
        {favorites.map((game, index) => (
          <input
            key={index}
            className="w-full p-2 border rounded"
            placeholder={`Favorite Game ${index + 1}`}
            value={game}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
        <button
          onClick={handleRecommend}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Finding games..." : "Get Recommendations"}
        </button>
      </div>
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
      {recommendations.length > 0 && (
        <div className="mt-10 max-w-2xl mx-auto space-y-6">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              {rec.image && (
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-full rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{rec.name}</h2>
              <p className="text-gray-700 mt-1">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}