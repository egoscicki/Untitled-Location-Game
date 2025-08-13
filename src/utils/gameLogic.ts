import { Location, GameStage, GuessResult, SCORING } from '../types/game';

// Sample locations for prototype (in production, these would come from a database)
const SAMPLE_LOCATIONS: Location[] = [
  {
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    state: 'New York',
    country: 'United States',
    continent: 'North America',
    imageUrl: 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=40.7128,-74.0060&key=YOUR_API_KEY'
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    continent: 'North America',
    imageUrl: 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=34.0522,-118.2437&key=YOUR_API_KEY'
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    continent: 'Europe',
    imageUrl: 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=51.5074,-0.1278&key=YOUR_API_KEY'
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    continent: 'Europe',
    imageUrl: 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=48.8566,2.3522&key=YOUR_API_KEY'
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    imageUrl: 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=35.6762,139.6503&key=YOUR_API_KEY'
  }
];

export const getRandomLocation = (): Location => {
  const randomIndex = Math.floor(Math.random() * SAMPLE_LOCATIONS.length);
  return SAMPLE_LOCATIONS[randomIndex];
};

export const checkGuess = (
  stage: GameStage,
  guess: string,
  correctAnswer: string,
  previousGuesses: string[]
): GuessResult => {
  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedAnswer = correctAnswer.toLowerCase();
  
  const isCorrect = normalizedGuess === normalizedAnswer;
  const isFirstGuess = previousGuesses.length === 0;
  
  let points = 0;
  let message = '';
  
  if (isCorrect) {
    if (isFirstGuess) {
      points = SCORING[stage].first;
      message = `Perfect! +${points} points for getting ${stage} on the first try!`;
    } else {
      points = SCORING[stage].subsequent;
      message = `Correct! +${points} points for ${stage} (took ${previousGuesses.length + 1} tries)`;
    }
  } else {
    message = `Incorrect. The ${stage} is not "${guess}". Try again!`;
  }
  
  return { isCorrect, message, points };
};

export const getNextStage = (currentStage: GameStage): GameStage | null => {
  const stages: GameStage[] = ['continent', 'country', 'state', 'city'];
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getGameStatus = (
  currentStage: GameStage,
  totalGuesses: number
): 'playing' | 'won' | 'lost' => {
  if (currentStage === 'city' && totalGuesses <= 10) {
    return 'won';
  }
  if (totalGuesses >= 10) {
    return 'lost';
  }
  return 'playing';
};
