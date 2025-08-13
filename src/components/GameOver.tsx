import React from 'react';
import { motion } from 'framer-motion';
import { Location } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface GameOverProps {
  gameStatus: 'won' | 'lost';
  score: number;
  location: Location;
  onPlayAgain: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  gameStatus,
  score,
  location,
  onPlayAgain
}) => {
  const isWinner = gameStatus === 'won';
  
  const getResultMessage = () => {
    if (isWinner) {
      return {
        title: '🎉 Congratulations! 🎉',
        subtitle: 'You successfully guessed the location!',
        emoji: '🏆'
      };
    } else {
      return {
        title: '😔 Game Over',
        subtitle: 'You ran out of guesses!',
        emoji: '💀'
      };
    }
  };

  const getScoreMessage = () => {
    if (score >= 100) return 'Outstanding! You\'re a geography expert! 🌟';
    if (score >= 70) return 'Great job! You know your world! 🗺️';
    if (score >= 40) return 'Good effort! Keep learning! 📚';
    return 'Keep practicing! You\'ll get better! 💪';
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-container p-8 max-w-2xl w-full text-center"
      >
        {/* Result Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          {result.emoji}
        </motion.div>

        {/* Result Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          {result.title}
        </motion.h1>

        {/* Result Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-6"
        >
          {result.subtitle}
        </motion.p>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6"
        >
          <div className="text-4xl font-bold mb-2">
            {formatScore(score)}
          </div>
          <div className="text-lg">Final Score</div>
          <div className="text-sm opacity-90 mt-2">
            {getScoreMessage()}
          </div>
        </motion.div>

        {/* Location Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-100 p-6 rounded-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📍 The location was:
          </h3>
          <div className="space-y-2 text-gray-700">
            <div><strong>City:</strong> {location.city}</div>
            <div><strong>State:</strong> {location.state}</div>
            <div><strong>Country:</strong> {location.country}</div>
            <div><strong>Continent:</strong> {location.continent}</div>
          </div>
        </motion.div>

        {/* Play Again Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onPlayAgain}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
        >
          🎮 Play Again
        </motion.button>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-sm text-gray-500"
        >
          <p>Challenge yourself with a new random location!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameOver;
