import React from 'react';
import { motion } from 'framer-motion';
import { GameStage } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface ScoreDisplayProps {
  score: number;
  totalGuesses: number;
  currentStage: GameStage;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, totalGuesses, currentStage }) => {
  const getStageProgress = (): number => {
    const stages: GameStage[] = ['continent', 'country', 'state', 'city'];
    const currentIndex = stages.indexOf(currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getStageIcon = (stage: GameStage): string => {
    switch (stage) {
      case 'continent':
        return '🌍';
      case 'country':
        return '🏳️';
      case 'state':
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
      className="game-container p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold score-display mb-1">
            {formatScore(score)}
          </div>
          <div className="text-sm text-gray-600">Total Score</div>
        </div>

        {/* Guesses */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {totalGuesses}/10
          </div>
          <div className="text-sm text-gray-600">Guesses Used</div>
        </div>

        {/* Current Stage */}
        <div className="text-center">
          <div className="text-2xl mb-1">
            {getStageIcon(currentStage)}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {currentStage}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(getStageProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getStageProgress()}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="mt-4 flex justify-center space-x-2">
        {['continent', 'country', 'state', 'city'].map((stage, index) => (
          <div
            key={stage}
            className={`flex flex-col items-center ${
              index < ['continent', 'country', 'state', 'city'].indexOf(currentStage)
                ? 'text-green-600'
                : index === ['continent', 'country', 'state', 'city'].indexOf(currentStage)
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
