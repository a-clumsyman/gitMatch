import React from "react";

interface ScoreCardProps {
  score: number;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, className = "" }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent Match!";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Low Compatibility";
  };

  return (
    <div className={`relative px-4 sm:px-0 ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
      <div className="relative bg-gray-800/50 rounded-2xl p-6 sm:p-10 backdrop-blur-sm border border-white/10">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4">
            <span
              className={`bg-gradient-to-r ${getScoreColor(
                score
              )} text-transparent bg-clip-text`}
            >
              {score}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl text-gray-300 font-semibold mb-2 sm:mb-3">
            {getScoreText(score)}
          </div>
          <div className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Based on language compatibility, repository activity, and community
            engagement
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
