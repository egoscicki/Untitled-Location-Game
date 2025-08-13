import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types/game';
import { getRandomLocation, checkGuess, getNextStage, getGameStatus } from '../utils/gameLogic';
import { placesApiService } from '../services/placesApi';
import LocationImage from './LocationImage';
import GuessInput from './GuessInput';
import ScoreDisplay from './ScoreDisplay';
import GameOver from './GameOver';
import HintButton from './HintButton';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLocation: null,
    currentStage: 'continent',
    guesses: {
      continent: [],
      country: [],
      region: [],
      city: []
    },
    totalGuesses: 0,
    score: 0,
    gameStatus: 'playing',
    isLoading: true,
    hintsUsed: 0
  });

  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [hintValue, setHintValue] = useState<string>('');

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      await placesApiService.initialize();
      const newLocation = await getRandomLocation();
      setGameState(prev => ({
        ...prev,
        currentLocation: newLocation,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleHintUsed = () => {
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
  };

  const handleHintSelected = (hint: string) => {
    setHintValue(hint);
  };

  const handleGuess = async (guess: string) => {
    if (!gameState.currentLocation) return;

    const currentStage = gameState.currentStage;
    const correctAnswer = gameState.currentLocation[currentStage];
    const previousGuesses = gameState.guesses[currentStage];

    const result = checkGuess(currentStage, guess, correctAnswer, previousGuesses);

    // Update guesses
    const newGuesses = {
      ...gameState.guesses,
      [currentStage]: [...previousGuesses, guess]
    };

    // Update score
    const newScore = gameState.score + result.points;

    // Update total guesses
    const newTotalGuesses = gameState.totalGuesses + 1;

    // Show message
    setMessage(result.message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);

    // Clear hint value after guess
    setHintValue('');

    if (result.isCorrect) {
      // Move to next stage or win
      const nextStage = getNextStage(currentStage);
      
      if (nextStage) {
        // Move to next stage
        setGameState(prev => ({
          ...prev,
          currentStage: nextStage,
          guesses: newGuesses,
          score: newScore,
          totalGuesses: newTotalGuesses
        }));
      } else {
        // Game won!
        const finalGameStatus = getGameStatus('city', newTotalGuesses);
        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          score: newScore,
          totalGuesses: newTotalGuesses,
          gameStatus: finalGameStatus
        }));
      }
    } else {
      // Check if game is lost
      const gameStatus = getGameStatus(currentStage, newTotalGuesses);
      
      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        score: newScore,
        totalGuesses: newTotalGuesses,
        gameStatus
      }));
    }
  };

  const resetGame = async () => {
    try {
      const newLocation = await getRandomLocation();
      setGameState({
        currentLocation: newLocation,
        currentStage: 'continent',
        guesses: {
          continent: [],
          country: [],
          region: [],
          city: []
        },
        totalGuesses: 0,
        score: 0,
        gameStatus: 'playing',
        isLoading: false,
        hintsUsed: 0
      });
      setMessage('');
      setShowMessage(false);
      setHintValue('');
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  if (gameState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  if (gameState.gameStatus !== 'playing') {
    return (
      <GameOver
        gameStatus={gameState.gameStatus}
        score={gameState.score}
        location={gameState.currentLocation!}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Wherizit</h1>
          <p className="text-white/80 text-lg">Guess the location from the image!</p>
        </motion.div>

        {/* Score Display */}
        <ScoreDisplay
          score={gameState.score}
          totalGuesses={gameState.totalGuesses}
          currentStage={gameState.currentStage}
          hintsUsed={gameState.hintsUsed}
        />

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-container p-6 mb-6"
        >
          {/* Location Image */}
          <LocationImage
            imageUrl={gameState.currentLocation?.imageUrl || ''}
            city={gameState.currentLocation?.city || ''}
          />

          {/* Hint Button */}
          <div className="mt-4 flex justify-center">
            <HintButton
              currentStage={gameState.currentStage}
              currentLocation={gameState.currentLocation}
              hintsUsed={gameState.hintsUsed}
              onHintUsed={handleHintUsed}
              onHintSelected={handleHintSelected}
            />
          </div>

          {/* Guess Input */}
          <div className="mt-6">
            <GuessInput
              currentStage={gameState.currentStage}
              onGuess={handleGuess}
              previousGuesses={gameState.guesses[gameState.currentStage]}
              currentLocation={gameState.currentLocation}
              hintValue={hintValue}
            />
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6"
        >
          <div className="flex justify-center space-x-2">
            {['continent', 'country', 'region', 'city'].map((stage, index) => (
              <div
                key={stage}
                className={`w-3 h-3 rounded-full ${
                  gameState.currentStage === stage
                    ? 'bg-blue-500'
                    : index < ['continent', 'country', 'region', 'city'].indexOf(gameState.currentStage)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-white/70 text-sm mt-2">
            Stage {['continent', 'country', 'region', 'city'].indexOf(gameState.currentStage) + 1} of 4
          </p>
        </motion.div>
      </div>

      {/* Fixed Position Toaster - Appears in middle of screen */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-purple-50/90 backdrop-blur-sm rounded-2xl px-12 py-4 shadow-2xl border border-purple-200/50">
              <p className="text-gray-800 font-semibold text-lg text-center">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
