import React from 'react';
import { motion } from 'framer-motion';
import { GameStage } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface ScoreDisplayProps {
  score: number;
  totalGuesses: number;
  currentStage: GameStage;
  hintsUsed?: number;
  gameMode?: 'us' | 'world';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, totalGuesses, currentStage, hintsUsed = 0, gameMode = 'world' }) => {
  const getStageProgress = (): number => {
    if (gameMode === 'us') {
      // US mode: region (0%) -> city (100%)
      const stages: GameStage[] = ['region', 'city'];
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex === -1) return 0; // If somehow not in expected stages
      return (currentIndex / (stages.length - 1)) * 100;
    } else {
      // World mode: continent (0%) -> country (25%) -> region (50%) -> city (100%)
      const stages: GameStage[] = ['continent', 'country', 'region', 'city'];
      const currentIndex = stages.indexOf(currentStage);
      return (currentIndex / (stages.length - 1)) * 100;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-6"
    >
      <div className="game-container p-3">
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
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;
