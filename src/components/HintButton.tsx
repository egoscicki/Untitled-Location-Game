import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStage, Location, MAX_HINTS } from '../types/game';

// Custom hook for audio management
const useAudio = (src: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.6; // Set volume to 60%
      audioRef.current.preload = 'auto'; // Preload the audio
      
      // Add error handling
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
      
      console.log('🎵 Audio loaded:', src);
    }
  }, [src]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to beginning
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
        // Try to reload and play again
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(e => console.error('Retry failed:', e));
        }
      });
    } else {
      console.warn('Audio not loaded yet:', src);
    }
  };

  return { play };
};

interface HintButtonProps {
  currentStage: GameStage;
  currentLocation: Location | null;
  hintsUsed: number;
  onHintUsed: () => void;
  onHintSelected: (hint: string) => void; // This will now auto-submit the guess
}

const HintButton: React.FC<HintButtonProps> = ({
  currentStage,
  currentLocation,
  hintsUsed,
  onHintUsed,
  onHintSelected
}) => {
  const [showHint, setShowHint] = useState(false);
  const [hintOptions, setHintOptions] = useState<string[]>([]);

  // Audio hook for hint usage
  const hintAudio = useAudio('/sounds/hint.mp3');

  const generateHint = (): void => {
    if (!currentLocation || hintsUsed >= MAX_HINTS) return;

    // Play hint sound
    hintAudio.play();

    let options: string[] = [];
    const correctAnswer = currentLocation[currentStage];
    
    switch (currentStage) {
      case 'continent':
        options = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
        break;
      case 'country':
        // Use countries from the same continent
        const continentCountries = {
          'North America': ['United States', 'Canada', 'Mexico', 'Costa Rica', 'Panama'],
          'Europe': ['United Kingdom', 'France', 'Germany', 'Italy', 'Spain'],
          'Asia': ['Japan', 'China', 'South Korea', 'India', 'Thailand'],
          'Oceania': ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Vanuatu'],
          'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia'],
          'Africa': ['Egypt', 'South Africa', 'Morocco', 'Kenya', 'Nigeria']
        };
        options = continentCountries[currentLocation.continent as keyof typeof continentCountries] || 
                  ['United States', 'United Kingdom', 'France', 'Japan', 'Australia'];
        break;
      case 'region':
        // Use regions from the same country
        const countryRegions = {
          'United States': ['California', 'Texas', 'Florida', 'New York', 'Illinois'],
          'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
          'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Channel Islands'],
          'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes'],
          'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka'],
          'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'],
          'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan']
        };
        options = countryRegions[currentLocation.country as keyof typeof countryRegions] || 
                  ['California', 'New South Wales', 'England', 'Île-de-France', 'Tokyo'];
        break;
      case 'city':
        // Use cities from the same country
        const countryCities = {
          'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
          'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
          'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
          'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
          'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
          'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
          'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan']
        };
        options = countryCities[currentLocation.country as keyof typeof countryCities] || 
                  ['New York', 'Sydney', 'London', 'Paris', 'Tokyo'];
        break;
    }
    
    // Remove the correct answer and shuffle
    options = options.filter(option => option !== correctAnswer);
    options = shuffleArray(options);
    
    // Take first 3 wrong options and add correct answer (total of 4)
    const wrongOptions = options.slice(0, 3);
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
    // Auto-submit the selected hint instead of just prepopulating
    onHintSelected(option);
  };

  const remainingHints = MAX_HINTS - hintsUsed;

  return (
    <div className="relative">
      <button
        onClick={generateHint}
        disabled={remainingHints <= 0}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          remainingHints > 0
            ? 'bg-purple-700 text-white hover:bg-purple-800'
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
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] pointer-events-auto">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                💡 Hint for {currentStage}:
              </h4>
              {/* 2x2 Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                {hintOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Click an option to submit it as your guess!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HintButton;
