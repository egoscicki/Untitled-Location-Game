import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStage, Location, CONTINENTS } from '../types/game';
import { placesApiService } from '../services/placesApi';

interface GuessInputProps {
  currentStage: GameStage;
  onGuess: (guess: string) => void;
  previousGuesses: string[];
  currentLocation: Location | null;
}

const GuessInput: React.FC<GuessInputProps> = ({
  currentStage,
  onGuess,
  previousGuesses,
  currentLocation
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  }, [currentStage]);

  const getStageLabel = (stage: GameStage): string => {
    switch (stage) {
      case 'continent':
        return 'Which continent is this location in?';
      case 'country':
        return 'Which country is this location in?';
      case 'state':
        return 'Which US state is this location in?';
      case 'city':
        return 'Which city is this location?';
      default:
        return '';
    }
  };

  const getInputType = (stage: GameStage): 'dropdown' | 'autocomplete' => {
    if (stage === 'continent') return 'dropdown';
    return 'autocomplete';
  };

  const getOptions = (stage: GameStage): string[] => {
    if (stage === 'continent') return [...CONTINENTS];
    return [];
  };

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    
    if (getInputType(currentStage) === 'autocomplete' && value.length > 1) {
      try {
        let newSuggestions: string[] = [];
        
        if (currentStage === 'country') {
          newSuggestions = await placesApiService.getCountrySuggestions(value);
        } else if (currentStage === 'state') {
          // Get US state suggestions
          newSuggestions = await placesApiService.getStateSuggestions(value);
        } else if (currentStage === 'city') {
          const country = currentLocation?.country || '';
          newSuggestions = await placesApiService.getCitySuggestions(value, country);
        }
        
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onGuess(inputValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onGuess(suggestion);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      onGuess(value);
    }
  };

  const renderInput = () => {
    const inputType = getInputType(currentStage);
    
    if (inputType === 'dropdown') {
      const options = getOptions(currentStage);
      return (
        <select
          value={inputValue}
          onChange={handleDropdownChange}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Select {currentStage}...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={`Enter ${currentStage}...`}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          autoFocus
        />
        
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      key={currentStage}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        {getStageLabel(currentStage)}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInput()}
        
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit Guess
        </button>
      </form>
      
      {/* Previous guesses display */}
      {previousGuesses.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Previous guesses:</p>
          <div className="flex flex-wrap gap-2">
            {previousGuesses.map((guess, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
              >
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GuessInput;
