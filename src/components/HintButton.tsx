import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStage, Location, MAX_HINTS } from '../types/game';

interface HintButtonProps {
  currentStage: GameStage;
  currentLocation: Location | null;
  hintsUsed: number;
  onHintUsed: () => void;
}

const HintButton: React.FC<HintButtonProps> = ({
  currentStage,
  currentLocation,
  hintsUsed,
  onHintUsed
}) => {
  const [showHint, setShowHint] = useState(false);
  const [hintOptions, setHintOptions] = useState<string[]>([]);

  const generateHint = (): void => {
    if (!currentLocation || hintsUsed >= MAX_HINTS) return;

    let options: string[] = [];
    const correctAnswer = currentLocation[currentStage];
    
    switch (currentStage) {
      case 'continent':
        options = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
        break;
      case 'country':
        options = ['United States', 'United Kingdom', 'France', 'Japan', 'Australia', 'Brazil', 'Egypt', 'Germany', 'Italy', 'Spain'];
        break;
      case 'state':
        options = ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
        break;
      case 'city':
        options = ['New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Sydney', 'Rio de Janeiro', 'Cairo', 'Berlin', 'Rome'];
        break;
    }
    
    // Remove the correct answer and shuffle
    options = options.filter(option => option !== correctAnswer);
    options = shuffleArray(options);
    
    // Take first 4 wrong options and add correct answer
    const wrongOptions = options.slice(0, 4);
    const allOptions = [...wrongOptions, correctAnswer];
    
    // Shuffle again so correct answer isn't always last
    setHintOptions(shuffleArray(allOptions));
    setShowHint(true);
    onHintUsed();
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleOptionClick = (option: string) => {
    setShowHint(false);
    // The user can now see the hint options, but they still need to type their guess
  };

  const remainingHints = MAX_HINTS - hintsUsed;

  return (
    <div className="relative">
      <button
        onClick={generateHint}
        disabled={remainingHints <= 0}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          remainingHints > 0
            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
        }`}
      >
        💡 Hint ({remainingHints} left)
      </button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 z-20 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
          >
            <h4 className="font-semibold text-gray-800 mb-3">
              💡 Hint for {currentStage}:
            </h4>
            <div className="space-y-2">
              {hintOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              One of these options is correct!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HintButton;
