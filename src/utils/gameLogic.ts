import { Location, GameStage, GuessResult, SCORING, Hint } from '../types/game';

// Sample locations with better outdoor/landscape images and universal terminology
const SAMPLE_LOCATIONS: Location[] = [
  {
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    region: 'New York',
    country: 'United States',
    continent: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    city: 'Los Angeles',
    region: 'California',
    country: 'United States',
    continent: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1544919972-8e75be0d8bca?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: 'London',
    region: 'England',
    country: 'United Kingdom',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1502602898534-861c5e4c1f0b?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    city: 'Sydney',
    region: 'New South Wales',
    country: 'Australia',
    continent: 'Oceania',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    city: 'Rio de Janeiro',
    region: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  {
    lat: 30.0444,
    lng: 31.2357,
    city: 'Cairo',
    region: 'Cairo',
    country: 'Egypt',
    continent: 'Africa',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
  }
];

export const getRandomLocation = (): Location => {
  const randomIndex = Math.floor(Math.random() * SAMPLE_LOCATIONS.length);
  return SAMPLE_LOCATIONS[randomIndex];
};

export const generateHint = (stage: GameStage, correctAnswer: string, currentLocation: Location): Hint => {
  let options: string[] = [];
  
  switch (stage) {
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
  
  // Take first 4 wrong options and add correct answer
  const wrongOptions = options.slice(0, 4);
  const allOptions = [...wrongOptions, correctAnswer];
  
  // Shuffle again so correct answer isn't always last
  return {
    options: shuffleArray(allOptions),
    correctAnswer,
    stage
  };
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
  const stages: GameStage[] = ['continent', 'country', 'region', 'city'];
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
