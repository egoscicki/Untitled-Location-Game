import React from 'react';
import { motion } from 'framer-motion';

interface GameModeSelectionProps {
  onGameModeSelected: (mode: 'us' | 'world') => void;
}

const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onGameModeSelected }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-4"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/Wherzit_logo.svg" 
              alt="Wherzit Logo" 
              className="w-full h-full"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Wherzit</h1>
          <p className="text-white/80 text-lg">Choose your adventure!</p>
        </motion.div>

        {/* Game Mode Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* United States Mode */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGameModeSelected('us')}
            className="w-full bg-white text-purple-700 px-8 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            🇺🇸 United States
          </motion.button>

          {/* The World Mode */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGameModeSelected('world')}
            className="w-full bg-white/10 text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-200"
          >
            🌍 The World
          </motion.button>
        </motion.div>

        {/* Mode Descriptions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-white/80 text-sm space-y-2"
        >
          <p><strong>United States:</strong> Start with state guessing, US locations only</p>
          <p><strong>The World:</strong> Full game from continent to city</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameModeSelection;
