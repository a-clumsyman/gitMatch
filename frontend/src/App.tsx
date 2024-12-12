import React, { useState } from "react";
import UserCard from "./components/UserCard";
import { Profile, getProfile } from "./utils/api";
import { calculateMatchScore } from "./utils/scores";
import ScoreCard from "./components/ScoreCard";

function App() {
  const [username, setUsername] = useState("");
  const [matchUsername, setMatchUsername] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(username);
      setProfile(data);
      setMatchProfile(null);
      setMatchScore(null);
      setMatchUsername("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMatch = async () => {
    if (!matchUsername) {
      setError("Please enter a GitHub username to match with");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const matchData = await getProfile(matchUsername);
      setMatchProfile(matchData);
      const score = calculateMatchScore(profile!, matchData);
      setMatchScore(score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check match");
      setMatchProfile(null);
      setMatchScore(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setMatchProfile(null);
    setMatchScore(null);
    setUsername("");
    setMatchUsername("");
    setError(null);
  };

  const handleNewMatch = () => {
    setMatchProfile(null);
    setMatchScore(null);
    setMatchUsername("");
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(64,96,217,0.2)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(128,64,217,0.2)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(64,217,192,0.2)_0%,_transparent_50%)]"></div>
        {/* Floating Particles */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 20}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">GitMatch</h1>
          <p className="text-gray-400">Find your perfect coding partner</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
              {error}
            </div>
          </div>
        )}

        {!profile ? (
          // Initial Search
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="space-y-6">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter GitHub username"
                    className="w-full px-4 py-4 bg-gray-900/50 rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-lg"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="relative w-full group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative px-4 py-4 bg-gray-900 rounded-xl leading-none flex items-center justify-center">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="text-lg font-semibold">
                            Searching...
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold">
                          Search Developer
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !matchProfile ? (
          // Profile and Match Search
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="max-w-xl mx-auto">
              <UserCard profile={profile} />
            </div>

            <div className="max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
                      Check Compatibility
                    </h2>
                    <p className="text-lg text-gray-400">
                      Enter another developer's username to see your match score
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={matchUsername}
                      onChange={(e) => setMatchUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCheckMatch()}
                      placeholder="Enter GitHub username to match with"
                      className="w-full px-4 py-4 bg-gray-900/50 rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-lg"
                      disabled={loading}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-4 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={handleCheckMatch}
                        disabled={loading}
                        className="relative flex-1 group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative px-4 py-4 bg-gray-900 rounded-xl leading-none flex items-center justify-center">
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-5 w-5"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span className="text-lg font-semibold">
                                Checking...
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-semibold">
                              Check Match
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Match Results
          <div className="space-y-8">
            {matchScore !== null && (
              <ScoreCard
                score={matchScore}
                className="max-w-2xl mx-auto transform hover:scale-105 transition-transform"
              />
            )}

            <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
              <div className="w-full lg:w-1/2 transform transition-all duration-500 hover:translate-x-2">
                <UserCard profile={profile} />
              </div>
              <div className="w-full lg:w-1/2 transform transition-all duration-500 hover:translate-x-2">
                <UserCard profile={matchProfile} />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleNewMatch}
                className="px-6 py-3 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Try Another Match
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
