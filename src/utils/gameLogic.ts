import { Location, GameStage, GuessResult, SCORING, Hint } from '../types/game';
import { placesApiService } from '../services/placesApi';

// Generate fresh random coordinates for each location
const getRandomizedCoordinates = (baseLat: number, baseLng: number) => {
  // Small random offset (±0.005 degrees = roughly ±500 meters)
  const latOffset = (Math.random() - 0.5) * 0.01;
  const lngOffset = (Math.random() - 0.5) * 0.01;
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  };
};

// Sample locations with base coordinates (will be randomized each time)
const BASE_LOCATIONS = [
  { baseLat: 40.7128, baseLng: -74.0060, city: 'New York', region: 'New York', country: 'United States', continent: 'North America' },
  { baseLat: 34.0522, baseLng: -118.2437, city: 'Los Angeles', region: 'California', country: 'United States', continent: 'North America' },
  { baseLat: 51.5074, baseLng: -0.1278, city: 'London', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 48.8566, baseLng: 2.3522, city: 'Paris', region: 'Île-de-France', country: 'France', continent: 'Europe' },
  { baseLat: 35.6762, baseLng: 139.6503, city: 'Tokyo', region: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { baseLat: -33.8688, baseLng: 151.2093, city: 'Sydney', region: 'New South Wales', country: 'Australia', continent: 'Oceania' },
  { baseLat: -22.9068, baseLng: -43.1729, city: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { baseLat: 30.0444, baseLng: 31.2357, city: 'Cairo', region: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { baseLat: 52.5200, baseLng: 13.4050, city: 'Berlin', region: 'Berlin', country: 'Germany', continent: 'Europe' },
  { baseLat: 41.9028, baseLng: 12.4964, city: 'Rome', region: 'Lazio', country: 'Italy', continent: 'Europe' },
  { baseLat: 37.7749, baseLng: -122.4194, city: 'San Francisco', region: 'California', country: 'United States', continent: 'North America' },
  { baseLat: 25.7617, baseLng: -80.1918, city: 'Miami', region: 'Florida', country: 'United States', continent: 'North America' },
  { baseLat: 55.7558, baseLng: 37.6176, city: 'Moscow', region: 'Moscow', country: 'Russia', continent: 'Europe' },
  { baseLat: 39.9042, baseLng: 116.4074, city: 'Beijing', region: 'Beijing', country: 'China', continent: 'Asia' },
  { baseLat: 19.0760, baseLng: 72.8777, city: 'Mumbai', region: 'Maharashtra', country: 'India', continent: 'Asia' },
  { baseLat: -26.2041, baseLng: 28.0473, city: 'Johannesburg', region: 'Gauteng', country: 'South Africa', continent: 'Africa' }
];

// Completely rewritten randomization system
let usedIndices = new Set<number>();
let consecutiveCount = 0;

const getTrulyRandomIndex = (max: number): number => {
  // If we've used most indices, reset to allow reuse
  if (usedIndices.size >= max * 0.8) {
    usedIndices.clear();
    console.log('🔄 Reset used indices - allowing reuse of locations');
  }
  
  let attempts = 0;
  let randomIndex: number;
  
  do {
    // Use crypto.randomValues for maximum randomness
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      randomIndex = array[0] % max;
    } else {
      // Fallback with multiple entropy sources
      const timestamp = Date.now();
      const perfTime = typeof performance !== 'undefined' ? performance.now() : timestamp;
      const mathRandom = Math.random();
      
      randomIndex = Math.floor(((timestamp % max) + (perfTime % max) + (mathRandom * max)) / 3);
    }
    
    attempts++;
    
    // Prevent infinite loops
    if (attempts > 100) {
      console.warn('⚠️ Too many attempts, forcing random selection');
      break;
    }
  } while (usedIndices.has(randomIndex));
  
  // Track this index as used
  usedIndices.add(randomIndex);
  
  console.log(`🎲 Random index ${randomIndex} selected after ${attempts} attempts`);
  console.log(`📊 Used indices: ${usedIndices.size}/${max} (${Math.round((usedIndices.size / max) * 100)}%)`);
  
  return randomIndex;
};

export const getRandomLocation = async (): Promise<Location> => {
  // Occasionally shuffle the locations array to prevent patterns
  consecutiveCount++;
  if (consecutiveCount % 2 === 0) { // Shuffle every 2 calls instead of 5
    shuffleArray(BASE_LOCATIONS);
    console.log('🔄 Shuffled locations array to prevent patterns');
  }
  
  // Use a more robust random number generation
  const randomIndex = getTrulyRandomIndex(BASE_LOCATIONS.length);
  const location = BASE_LOCATIONS[randomIndex];
  
  // Generate 3 different Street View images for carousel
  const imageUrls: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const { lat, lng } = getRandomizedCoordinates(location.baseLat, location.baseLng);
    const imageUrl = await placesApiService.getStreetViewImage(lat, lng, '600x400', i);
    imageUrls.push(imageUrl);
  }
  
  const { lat, lng } = getRandomizedCoordinates(location.baseLat, location.baseLng);
  
  console.log('🎯 Selected location:', location.city, location.country);
  console.log('📍 Total locations available:', BASE_LOCATIONS.length);
  console.log('🔄 Consecutive count:', consecutiveCount);
  console.log('🖼️ Generated 3 Street View images for carousel');
  
  return {
    lat,
    lng,
    city: location.city,
    region: location.region,
    country: location.country,
    continent: location.continent,
    imageUrl: imageUrls[0], // First image as default
    imageUrls: imageUrls // All 3 images for carousel
  };
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
        'United States': ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
        'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
        'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Channel Islands', 'Isle of Man'],
        'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Normandie', 'Pays de la Loire'],
        'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka', 'Aichi', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo'],
        'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina'],
        'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada', 'Dahab', 'Siwa', 'Marsa Alam'],
        'Germany': ['Berlin', 'Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse', 'Rhineland-Palatinate', 'Saxony', 'Thuringia', 'Brandenburg'],
        'Italy': ['Lazio', 'Lombardy', 'Campania', 'Sicily', 'Piedmont', 'Veneto', 'Puglia', 'Emilia-Romagna', 'Tuscany', 'Calabria'],
        'China': ['Beijing', 'Shanghai', 'Guangdong', 'Jiangsu', 'Shandong', 'Henan', 'Sichuan', 'Hunan', 'Hebei', 'Anhui'],
        'India': ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'],
        'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape']
      };
      options = countryRegions[currentLocation.country as keyof typeof countryRegions] || 
                ['California', 'New South Wales', 'England', 'Île-de-France', 'Tokyo', 'Berlin', 'Lazio', 'Beijing', 'Maharashtra', 'Gauteng'];
      break;
    case 'city':
      // Use cities from the same country
      const countryCities = {
        'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Miami', 'Philadelphia', 'San Antonio', 'San Diego'],
        'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
        'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Glasgow', 'Leicester'],
        'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
        'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Kobe', 'Fukuoka', 'Kawasaki', 'Saitama'],
        'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
        'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada', 'Dahab', 'Siwa', 'Marsa Alam'],
        'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
        'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
        'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Chongqing', 'Nanjing', 'Wuhan', 'Xi\'an'],
        'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'],
        'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Kimberley', 'Nelspruit', 'Polokwane']
      };
      options = countryCities[currentLocation.country as keyof typeof countryCities] || 
                ['New York', 'Sydney', 'London', 'Paris', 'Tokyo', 'Berlin', 'Rome', 'Beijing', 'Mumbai', 'Johannesburg'];
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

// Improved Fisher-Yates shuffle with crypto randomness
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  
  // Use crypto.randomValues for shuffle if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    // Fallback to Math.random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  
  console.log('🔄 Array shuffled with crypto randomness');
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
