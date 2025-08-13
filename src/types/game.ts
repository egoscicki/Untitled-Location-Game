export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
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
    state: string[];
    city: string[];
  };
  totalGuesses: number;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isLoading: boolean;
}

export type GameStage = 'continent' | 'country' | 'state' | 'city';

export interface GuessResult {
  isCorrect: boolean;
  message: string;
  points: number;
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

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
] as const;

export const SCORING = {
  continent: { first: 10, subsequent: 5 },
  country: { first: 20, subsequent: 10 },
  state: { first: 30, subsequent: 15 },
  city: { first: 50, subsequent: 25 }
} as const;
