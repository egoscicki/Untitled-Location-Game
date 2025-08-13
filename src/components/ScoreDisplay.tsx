import React from 'react';
import { motion } from 'framer-motion';
import { GameStage } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface ScoreDisplayProps {
  score: number;
  totalGuesses: number;
  currentStage: GameStage;
  hintsUsed?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, totalGuesses, currentStage, hintsUsed = 0 }) => {
  const getStageProgress = (): number => {
    const stages: GameStage[] = ['continent', 'country', 'region', 'city'];
    const currentIndex = stages.indexOf(currentStage);
    return (currentIndex / stages.length) * 100;
  };

  const getStageIcon = (stage: GameStage): string => {
    switch (stage) {
      case 'continent':
        return '🌍';
      case 'country':
        return '🏳️';
      case 'region':
        return '🗺️';
      case 'city':
        return '🏙️';
      default:
        return '📍';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-container p-3 mb-4"
    >
      <div className="grid grid-cols-3 gap-2">
        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold score-display mb-1">
            {formatScore(score)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Score</div>
        </div>

        {/* Guesses */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {totalGuesses}/10
          </div>
          <div className="text-sm text-gray-600 font-medium">Guesses</div>
        </div>

        {/* Hints Used */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {hintsUsed}/3
          </div>
          <div className="text-sm text-gray-600 font-medium">Hints</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(getStageProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getStageProgress()}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stage Indicators - Hidden on mobile to save space */}
      <div className="hidden md:flex mt-3 justify-center space-x-2">
        {['continent', 'country', 'region', 'city'].map((stage, index) => (
          <div
            key={stage}
            className={`flex flex-col items-center ${
              index < ['continent', 'country', 'region', 'city'].indexOf(currentStage)
                ? 'text-green-600'
                : index === ['continent', 'country', 'region', 'city'].indexOf(currentStage)
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div className="text-lg mb-1">
              {getStageIcon(stage as GameStage)}
            </div>
            <div className="text-xs capitalize">{stage}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;
