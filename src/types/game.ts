export interface Location {
  lat: number;
  lng: number;
  city: string;
  region: string; // Changed from 'state' to 'region' for universal use
  country: string;
  continent: string;
  imageUrl: string;
}

export interface GameState {
  currentLocation: Location | null;
  currentStage: GameStage;
  guesses: {
    continent: string[];
    country: string[];
    region: string[]; // Changed from 'state' to 'region'
    city: string[];
  };
  totalGuesses: number;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isLoading: boolean;
  hintsUsed: number;
}

export type GameStage = 'continent' | 'country' | 'region' | 'city'; // Changed 'state' to 'region'

export interface GuessResult {
  isCorrect: boolean;
  message: string;
  points: number;
}

export interface Hint {
  options: string[];
  correctAnswer: string;
  stage: GameStage;
}

export const CONTINENTS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America'
] as const;

export const SCORING = {
  continent: { first: 10, subsequent: 5 },
  country: { first: 20, subsequent: 10 },
  region: { first: 30, subsequent: 15 }, // Changed from 'state' to 'region'
  city: { first: 50, subsequent: 25 }
} as const;

export const MAX_HINTS = 3;
