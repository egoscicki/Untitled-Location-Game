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
  // US Locations - Expanded variety
  { baseLat: 40.7128, baseLng: -74.0060, city: 'New York', region: 'New York', country: 'United States', continent: 'North America' },
  { baseLat: 34.0522, baseLng: -118.2437, city: 'Los Angeles', region: 'California', country: 'United States', continent: 'North America' },
  { baseLat: 37.7749, baseLng: -122.4194, city: 'San Francisco', region: 'California', country: 'United States', continent: 'North America' },
  { baseLat: 25.7617, baseLng: -80.1918, city: 'Miami', region: 'Florida', country: 'United States', continent: 'North America' },
  { baseLat: 41.8781, baseLng: -87.6298, city: 'Chicago', region: 'Illinois', country: 'United States', continent: 'North America' },
  { baseLat: 29.7604, baseLng: -95.3698, city: 'Houston', region: 'Texas', country: 'United States', continent: 'North America' },
  { baseLat: 33.4484, baseLng: -112.0740, city: 'Phoenix', region: 'Arizona', country: 'United States', continent: 'North America' },
  { baseLat: 39.9526, baseLng: -75.1652, city: 'Philadelphia', region: 'Pennsylvania', country: 'United States', continent: 'North America' },
  { baseLat: 32.7767, baseLng: -96.7970, city: 'Dallas', region: 'Texas', country: 'United States', continent: 'North America' },
  { baseLat: 32.7157, baseLng: -117.1611, city: 'San Diego', region: 'California', country: 'United States', continent: 'North America' },
  { baseLat: 39.7392, baseLng: -104.9903, city: 'Denver', region: 'Colorado', country: 'United States', continent: 'North America' },
  { baseLat: 47.6062, baseLng: -122.3321, city: 'Seattle', region: 'Washington', country: 'United States', continent: 'North America' },
  { baseLat: 42.3601, baseLng: -71.0589, city: 'Boston', region: 'Massachusetts', country: 'United States', continent: 'North America' },
  { baseLat: 36.1699, baseLng: -115.1398, city: 'Las Vegas', region: 'Nevada', country: 'United States', continent: 'North America' },
  { baseLat: 35.2271, baseLng: -80.8431, city: 'Charlotte', region: 'North Carolina', country: 'United States', continent: 'North America' },
  { baseLat: 39.9612, baseLng: -82.9988, city: 'Columbus', region: 'Ohio', country: 'United States', continent: 'North America' },
  { baseLat: 30.2672, baseLng: -97.7431, city: 'Austin', region: 'Texas', country: 'United States', continent: 'North America' },
  { baseLat: 40.4406, baseLng: -79.9959, city: 'Pittsburgh', region: 'Pennsylvania', country: 'United States', continent: 'North America' },
  { baseLat: 33.7490, baseLng: -84.3880, city: 'Atlanta', region: 'Georgia', country: 'United States', continent: 'North America' },
  { baseLat: 42.3314, baseLng: -83.0458, city: 'Detroit', region: 'Michigan', country: 'United States', continent: 'North America' },
  { baseLat: 38.9072, baseLng: -77.0369, city: 'Washington', region: 'District of Columbia', country: 'United States', continent: 'North America' },
  { baseLat: 44.0582, baseLng: -91.2344, city: 'La Crosse', region: 'Wisconsin', country: 'United States', continent: 'North America' },
  { baseLat: 44.9778, baseLng: -93.2650, city: 'Minneapolis', region: 'Minnesota', country: 'United States', continent: 'North America' },
  { baseLat: 38.6270, baseLng: -90.1994, city: 'St. Louis', region: 'Missouri', country: 'United States', continent: 'North America' },
  { baseLat: 39.2904, baseLng: -76.6122, city: 'Baltimore', region: 'Maryland', country: 'United States', continent: 'North America' },
  { baseLat: 35.1495, baseLng: -90.0490, city: 'Memphis', region: 'Tennessee', country: 'United States', continent: 'North America' },
  { baseLat: 29.9511, baseLng: -90.0715, city: 'New Orleans', region: 'Louisiana', country: 'United States', continent: 'North America' },
  { baseLat: 40.7128, baseLng: -74.0060, city: 'Jersey City', region: 'New Jersey', country: 'United States', continent: 'North America' },
  { baseLat: 41.7658, baseLng: -72.6734, city: 'Hartford', region: 'Connecticut', country: 'United States', continent: 'North America' },
  { baseLat: 44.0582, baseLng: -91.2344, city: 'Madison', region: 'Wisconsin', country: 'United States', continent: 'North America' },
  { baseLat: 40.7608, baseLng: -111.8910, city: 'Salt Lake City', region: 'Utah', country: 'United States', continent: 'North America' },
  { baseLat: 43.6150, baseLng: -116.2023, city: 'Boise', region: 'Idaho', country: 'United States', continent: 'North America' },
  { baseLat: 45.5152, baseLng: -122.6784, city: 'Portland', region: 'Oregon', country: 'United States', continent: 'North America' },
  { baseLat: 61.2181, baseLng: -149.9003, city: 'Anchorage', region: 'Alaska', country: 'United States', continent: 'North America' },
  { baseLat: 21.3099, baseLng: -157.8581, city: 'Honolulu', region: 'Hawaii', country: 'United States', continent: 'North America' },
  
  // International Locations
  { baseLat: 51.5074, baseLng: -0.1278, city: 'London', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 48.8566, baseLng: 2.3522, city: 'Paris', region: 'Île-de-France', country: 'France', continent: 'Europe' },
  { baseLat: 35.6762, baseLng: 139.6503, city: 'Tokyo', region: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { baseLat: -33.8688, baseLng: 151.2093, city: 'Sydney', region: 'New South Wales', country: 'Australia', continent: 'Oceania' },
  { baseLat: -22.9068, baseLng: -43.1729, city: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { baseLat: 30.0444, baseLng: 31.2357, city: 'Cairo', region: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { baseLat: 52.5200, baseLng: 13.4050, city: 'Berlin', region: 'Berlin', country: 'Germany', continent: 'Europe' },
  { baseLat: 41.9028, baseLng: 12.4964, city: 'Rome', region: 'Lazio', country: 'Italy', continent: 'Europe' },
  { baseLat: 55.7558, baseLng: 37.6176, city: 'Moscow', region: 'Moscow', country: 'Russia', continent: 'Europe' },
  { baseLat: 39.9042, baseLng: 116.4074, city: 'Beijing', region: 'Beijing', country: 'China', continent: 'Asia' },
  { baseLat: 19.0760, baseLng: 72.8777, city: 'Mumbai', region: 'Maharashtra', country: 'India', continent: 'Asia' },
  { baseLat: -26.2041, baseLng: 28.0473, city: 'Johannesburg', region: 'Gauteng', country: 'South Africa', continent: 'Africa' },
  
  // Additional Global Locations - Europe
  { baseLat: 52.3676, baseLng: 4.9041, city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', continent: 'Europe' },
  { baseLat: 40.4168, baseLng: -3.7038, city: 'Madrid', region: 'Madrid', country: 'Spain', continent: 'Europe' },
  { baseLat: 41.3851, baseLng: 2.1734, city: 'Barcelona', region: 'Catalonia', country: 'Spain', continent: 'Europe' },
  { baseLat: 59.3293, baseLng: 18.0686, city: 'Stockholm', region: 'Stockholm County', country: 'Sweden', continent: 'Europe' },
  { baseLat: 59.9139, baseLng: 10.7522, city: 'Oslo', region: 'Oslo County', country: 'Norway', continent: 'Europe' },
  { baseLat: 55.6761, baseLng: 12.5683, city: 'Copenhagen', region: 'Capital Region', country: 'Denmark', continent: 'Europe' },
  { baseLat: 60.1699, baseLng: 24.9384, city: 'Helsinki', region: 'Uusimaa', country: 'Finland', continent: 'Europe' },
  { baseLat: 47.4979, baseLng: 19.0402, city: 'Budapest', region: 'Central Hungary', country: 'Hungary', continent: 'Europe' },
  { baseLat: 50.0755, baseLng: 14.4378, city: 'Prague', region: 'Prague', country: 'Czech Republic', continent: 'Europe' },
  { baseLat: 52.2297, baseLng: 21.0122, city: 'Warsaw', region: 'Masovian Voivodeship', country: 'Poland', continent: 'Europe' },
  { baseLat: 48.2082, baseLng: 16.3738, city: 'Vienna', region: 'Vienna', country: 'Austria', continent: 'Europe' },
  { baseLat: 46.9479, baseLng: 7.4474, city: 'Bern', region: 'Bern Canton', country: 'Switzerland', continent: 'Europe' },
  { baseLat: 53.3498, baseLng: -6.2603, city: 'Dublin', region: 'Leinster', country: 'Ireland', continent: 'Europe' },
  { baseLat: 55.9533, baseLng: -3.1883, city: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 53.4808, baseLng: -2.2426, city: 'Manchester', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 52.4862, baseLng: -1.8904, city: 'Birmingham', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 53.4084, baseLng: -2.9916, city: 'Liverpool', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 53.8008, baseLng: -1.5491, city: 'Leeds', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 53.3811, baseLng: -1.4701, city: 'Sheffield', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 51.4545, baseLng: -2.5879, city: 'Bristol', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 55.8642, baseLng: -4.2518, city: 'Glasgow', region: 'Scotland', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 52.6309, baseLng: 1.2974, city: 'Norwich', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 50.8225, baseLng: -0.1372, city: 'Brighton', region: 'England', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 51.5074, baseLng: -0.1278, city: 'London', region: 'Greater London', country: 'United Kingdom', continent: 'Europe' },
  { baseLat: 48.8566, baseLng: 2.3522, city: 'Paris', region: 'Île-de-France', country: 'France', continent: 'Europe' },
  { baseLat: 43.2965, baseLng: 5.3698, city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', country: 'France', continent: 'Europe' },
  { baseLat: 45.7640, baseLng: 4.8357, city: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'France', continent: 'Europe' },
  { baseLat: 43.6047, baseLng: 1.4442, city: 'Toulouse', region: 'Occitanie', country: 'France', continent: 'Europe' },
  { baseLat: 43.7102, baseLng: 7.2620, city: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', country: 'France', continent: 'Europe' },
  { baseLat: 47.2184, baseLng: -1.5536, city: 'Nantes', region: 'Pays de la Loire', country: 'France', continent: 'Europe' },
  { baseLat: 48.5734, baseLng: 7.7521, city: 'Strasbourg', region: 'Grand Est', country: 'France', continent: 'Europe' },
  { baseLat: 43.6108, baseLng: 3.8767, city: 'Montpellier', region: 'Occitanie', country: 'France', continent: 'Europe' },
  { baseLat: 44.8378, baseLng: -0.5792, city: 'Bordeaux', region: 'Nouvelle-Aquitaine', country: 'France', continent: 'Europe' },
  { baseLat: 50.6292, baseLng: 3.0573, city: 'Lille', region: 'Hauts-de-France', country: 'France', continent: 'Europe' },
  { baseLat: 52.5200, baseLng: 13.4050, city: 'Berlin', region: 'Berlin', country: 'Germany', continent: 'Europe' },
  { baseLat: 53.5511, baseLng: 9.9937, city: 'Hamburg', region: 'Hamburg', country: 'Germany', continent: 'Europe' },
  { baseLat: 48.1351, baseLng: 11.5820, city: 'Munich', region: 'Bavaria', country: 'Germany', continent: 'Europe' },
  { baseLat: 50.9375, baseLng: 6.9603, city: 'Cologne', region: 'North Rhine-Westphalia', country: 'Germany', continent: 'Europe' },
  { baseLat: 50.1109, baseLng: 8.6821, city: 'Frankfurt', region: 'Hesse', country: 'Germany', continent: 'Europe' },
  { baseLat: 48.7758, baseLng: 9.1829, city: 'Stuttgart', region: 'Baden-Württemberg', country: 'Germany', continent: 'Europe' },
  { baseLat: 51.2277, baseLng: 6.7735, city: 'Düsseldorf', region: 'North Rhine-Westphalia', country: 'Germany', continent: 'Europe' },
  { baseLat: 51.5136, baseLng: 7.4653, city: 'Essen', region: 'North Rhine-Westphalia', country: 'Germany', continent: 'Europe' },
  { baseLat: 51.5136, baseLng: 7.4653, city: 'Dortmund', region: 'North Rhine-Westphalia', country: 'Germany', continent: 'Europe' },
  { baseLat: 51.3397, baseLng: 12.3731, city: 'Leipzig', region: 'Saxony', country: 'Germany', continent: 'Europe' },
  { baseLat: 41.9028, baseLng: 12.4964, city: 'Rome', region: 'Lazio', country: 'Italy', continent: 'Europe' },
  { baseLat: 45.4642, baseLng: 9.1900, city: 'Milan', region: 'Lombardy', country: 'Italy', continent: 'Europe' },
  { baseLat: 40.8518, baseLng: 14.2681, city: 'Naples', region: 'Campania', country: 'Italy', continent: 'Europe' },
  { baseLat: 45.0703, baseLng: 7.6869, city: 'Turin', region: 'Piedmont', country: 'Italy', continent: 'Europe' },
  { baseLat: 38.1157, baseLng: 13.3615, city: 'Palermo', region: 'Sicily', country: 'Italy', continent: 'Europe' },
  { baseLat: 44.4056, baseLng: 8.9463, city: 'Genoa', region: 'Liguria', country: 'Italy', continent: 'Europe' },
  { baseLat: 44.4949, baseLng: 11.3426, city: 'Bologna', region: 'Emilia-Romagna', country: 'Italy', continent: 'Europe' },
  { baseLat: 43.7696, baseLng: 11.2558, city: 'Florence', region: 'Tuscany', country: 'Italy', continent: 'Europe' },
  { baseLat: 41.1171, baseLng: 16.8719, city: 'Bari', region: 'Puglia', country: 'Italy', continent: 'Europe' },
  { baseLat: 37.5079, baseLng: 15.0830, city: 'Catania', region: 'Sicily', country: 'Italy', continent: 'Europe' },
  { baseLat: 55.7558, baseLng: 37.6176, city: 'Moscow', region: 'Moscow Oblast', country: 'Russia', continent: 'Europe' },
  { baseLat: 59.9311, baseLng: 30.3609, city: 'Saint Petersburg', region: 'Leningrad Oblast', country: 'Russia', continent: 'Europe' },
  { baseLat: 55.7887, baseLng: 49.1221, city: 'Kazan', region: 'Tatarstan', country: 'Russia', continent: 'Europe' },
  { baseLat: 56.2965, baseLng: 43.9361, city: 'Nizhny Novgorod', region: 'Nizhny Novgorod Oblast', country: 'Russia', continent: 'Europe' },
  { baseLat: 54.7065, baseLng: 20.5105, city: 'Kaliningrad', region: 'Kaliningrad Oblast', country: 'Russia', continent: 'Europe' },
  { baseLat: 55.8304, baseLng: 37.5271, city: 'Podolsk', region: 'Moscow Oblast', country: 'Russia', continent: 'Europe' },
  
  // Additional Global Locations - Asia
  { baseLat: 35.6762, baseLng: 139.6503, city: 'Tokyo', region: 'Tokyo Prefecture', country: 'Japan', continent: 'Asia' },
  { baseLat: 34.6937, baseLng: 135.5023, city: 'Osaka', region: 'Osaka Prefecture', country: 'Japan', continent: 'Asia' },
  { baseLat: 35.0116, baseLng: 135.7681, city: 'Kyoto', region: 'Kyoto Prefecture', country: 'Japan', continent: 'Asia' },
  { baseLat: 31.2304, baseLng: 121.4737, city: 'Shanghai', region: 'Shanghai Municipality', country: 'China', continent: 'Asia' },
  { baseLat: 23.1291, baseLng: 113.2644, city: 'Guangzhou', region: 'Guangdong Province', country: 'China', continent: 'Asia' },
  { baseLat: 22.3193, baseLng: 114.1694, city: 'Shenzhen', region: 'Guangdong Province', country: 'China', continent: 'Asia' },
  { baseLat: 28.7041, baseLng: 77.1025, city: 'New Delhi', region: 'Delhi Territory', country: 'India', continent: 'Asia' },
  { baseLat: 12.9716, baseLng: 77.5946, city: 'Bangalore', region: 'Karnataka State', country: 'India', continent: 'Asia' },
  { baseLat: 17.3850, baseLng: 78.4867, city: 'Hyderabad', region: 'Telangana State', country: 'India', continent: 'Asia' },
  { baseLat: 13.0827, baseLng: 80.2707, city: 'Chennai', region: 'Tamil Nadu State', country: 'India', continent: 'Asia' },
  { baseLat: 22.5726, baseLng: 88.3639, city: 'Kolkata', region: 'West Bengal State', country: 'India', continent: 'Asia' },
  { baseLat: 25.2048, baseLng: 55.2708, city: 'Dubai', region: 'Dubai Emirate', country: 'United Arab Emirates', continent: 'Asia' },
  { baseLat: 37.5665, baseLng: 126.9780, city: 'Seoul', region: 'Seoul Capital Area', country: 'South Korea', continent: 'Asia' },
  { baseLat: 13.7563, baseLng: 100.5018, city: 'Bangkok', region: 'Bangkok Metropolitan Region', country: 'Thailand', continent: 'Asia' },
  { baseLat: 14.5995, baseLng: 120.9842, city: 'Manila', region: 'Metro Manila', country: 'Philippines', continent: 'Asia' },
  { baseLat: 21.0285, baseLng: 105.8542, city: 'Hanoi', region: 'Hanoi Capital Region', country: 'Vietnam', continent: 'Asia' },
  { baseLat: 10.8231, baseLng: 106.6297, city: 'Ho Chi Minh City', region: 'Ho Chi Minh Metropolitan Area', country: 'Vietnam', continent: 'Asia' },
  { baseLat: 27.7172, baseLng: 85.3240, city: 'Kathmandu', region: 'Bagmati Province', country: 'Nepal', continent: 'Asia' },
  
  // Additional Global Locations - Africa
  { baseLat: 30.0444, baseLng: 31.2357, city: 'Cairo', region: 'Cairo Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 31.2001, baseLng: 29.9187, city: 'Alexandria', region: 'Alexandria Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 29.9792, baseLng: 31.1342, city: 'Giza', region: 'Giza Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 25.6872, baseLng: 32.6396, city: 'Luxor', region: 'Luxor Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 24.0889, baseLng: 32.8998, city: 'Aswan', region: 'Aswan Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 27.9158, baseLng: 34.3296, city: 'Sharm El Sheikh', region: 'South Sinai Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 27.2579, baseLng: 33.8116, city: 'Hurghada', region: 'Red Sea Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 28.5091, baseLng: 34.5166, city: 'Dahab', region: 'South Sinai Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 29.2041, baseLng: 25.5197, city: 'Siwa', region: 'Matruh Governorate', country: 'Egypt', continent: 'Africa' },
  { baseLat: 25.2048, baseLng: 55.2708, city: 'Dubai', region: 'Dubai Emirate', country: 'United Arab Emirates', continent: 'Asia' },
  { baseLat: 24.7136, baseLng: 46.6753, city: 'Riyadh', region: 'Riyadh Province', country: 'Saudi Arabia', continent: 'Asia' },
  { baseLat: 21.2703, baseLng: -157.8083, city: 'Honolulu', region: 'Hawaii', country: 'United States', continent: 'North America' },
  { baseLat: 21.4389, baseLng: -158.0000, city: 'Kapolei', region: 'Hawaii', country: 'United States', continent: 'North America' },
  { baseLat: 19.8968, baseLng: -155.5828, city: 'Kailua-Kona', region: 'Hawaii', country: 'United States', continent: 'North America' },
  { baseLat: 64.8255, baseLng: -147.6444, city: 'Fairbanks', region: 'Alaska', country: 'United States', continent: 'North America' },
  { baseLat: 64.2008, baseLng: -149.4937, city: 'North Pole', region: 'Alaska', country: 'United States', continent: 'North America' },
  { baseLat: 43.6532, baseLng: -79.3832, city: 'Toronto', region: 'Ontario Province', country: 'Canada', continent: 'North America' },
  { baseLat: 45.5017, baseLng: -73.5673, city: 'Montreal', region: 'Quebec Province', country: 'Canada', continent: 'North America' },
  { baseLat: 49.2827, baseLng: -123.1207, city: 'Vancouver', region: 'British Columbia Province', country: 'Canada', continent: 'North America' },
  { baseLat: 51.0447, baseLng: -114.0719, city: 'Calgary', region: 'Alberta Province', country: 'Canada', continent: 'North America' },
  { baseLat: 53.5461, baseLng: -113.4938, city: 'Edmonton', region: 'Alberta Province', country: 'Canada', continent: 'North America' },
  { baseLat: 45.4215, baseLng: -75.6972, city: 'Ottawa', region: 'Ontario Province', country: 'Canada', continent: 'North America' },
  { baseLat: 44.6488, baseLng: -63.5752, city: 'Halifax', region: 'Nova Scotia Province', country: 'Canada', continent: 'North America' },
  { baseLat: 46.8139, baseLng: -71.2080, city: 'Quebec City', region: 'Quebec Province', country: 'Canada', continent: 'North America' },
  { baseLat: 50.4501, baseLng: -104.6144, city: 'Regina', region: 'Saskatchewan Province', country: 'Canada', continent: 'North America' },
  { baseLat: 49.8951, baseLng: -97.1384, city: 'Winnipeg', region: 'Manitoba Province', country: 'Canada', continent: 'North America' },
  { baseLat: 47.5605, baseLng: -52.7126, city: 'St. John\'s', region: 'Newfoundland and Labrador Province', country: 'Canada', continent: 'North America' },
  { baseLat: 19.4326, baseLng: -99.1332, city: 'Mexico City', region: 'Mexico City Federal District', country: 'Mexico', continent: 'North America' },
  { baseLat: 20.6597, baseLng: -103.3496, city: 'Guadalajara', region: 'Jalisco State', country: 'Mexico', continent: 'North America' },
  { baseLat: 25.6866, baseLng: -100.3161, city: 'Monterrey', region: 'Nuevo León State', country: 'Mexico', continent: 'North America' },
  { baseLat: 32.5207, baseLng: -117.0117, city: 'Tijuana', region: 'Baja California State', country: 'Mexico', continent: 'North America' },
  { baseLat: 21.1619, baseLng: -86.8515, city: 'Cancún', region: 'Quintana Roo State', country: 'Mexico', continent: 'North America' },
  { baseLat: 20.5888, baseLng: -100.3899, city: 'Querétaro', region: 'Querétaro State', country: 'Mexico', continent: 'North America' },
  { baseLat: 16.8661, baseLng: -99.8877, city: 'Acapulco', region: 'Guerrero State', country: 'Mexico', continent: 'North America' },
  { baseLat: 23.6345, baseLng: -102.5528, city: 'Zacatecas', region: 'Zacatecas State', country: 'Mexico', continent: 'North America' }
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

export const getRandomLocation = async (gameMode: 'us' | 'world' = 'world'): Promise<Location> => {
  // Occasionally shuffle the locations array to prevent patterns
  consecutiveCount++;
  if (consecutiveCount % 2 === 0) { // Shuffle every 2 calls instead of 5
    shuffleArray(BASE_LOCATIONS);
    console.log('🔄 Shuffled locations array to prevent patterns');
  }
  
  // Filter locations based on game mode
  let availableLocations = BASE_LOCATIONS;
  if (gameMode === 'us') {
    availableLocations = BASE_LOCATIONS.filter(location => location.country === 'United States');
    console.log('🇺🇸 US Mode: Filtered to US locations only');
  }
  
  // Use a more robust random number generation
  const randomIndex = getTrulyRandomIndex(availableLocations.length);
  const location = availableLocations[randomIndex];
  
  // Generate 3 different Street View images for carousel
  const imageUrls: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const { lat, lng } = getRandomizedCoordinates(location.baseLat, location.baseLng);
    const imageUrl = await placesApiService.getStreetViewImage(lat, lng, '600x400', i);
    imageUrls.push(imageUrl);
  }
  
  const { lat, lng } = getRandomizedCoordinates(location.baseLat, location.baseLng);
  
  console.log('🎯 Selected location:', location.city, location.country);
  console.log('📍 Total locations available:', availableLocations.length);
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
  previousGuesses: string[],
  currentLocation?: Location
): GuessResult => {
  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedAnswer = correctAnswer.toLowerCase();
  
  let isCorrect = normalizedGuess === normalizedAnswer;
  
  // Special case: If user is on region stage and region/city have same name,
  // allow them to win by guessing the city name
  if (stage === 'region' && currentLocation && !isCorrect) {
    const normalizedCity = currentLocation.city.toLowerCase();
    if (normalizedGuess === normalizedCity && normalizedCity === normalizedAnswer) {
      isCorrect = true;
      console.log('🎯 Region/City same name detected - allowing win with city guess');
    }
  }
  
  const isFirstGuess = previousGuesses.length === 0;
  
  // Add debugging for city validation
  if (stage === 'city') {
    console.log('🏙️ City validation:');
    console.log('  User guess:', guess);
    console.log('  Correct answer:', correctAnswer);
    console.log('  Normalized guess:', normalizedGuess);
    console.log('  Normalized answer:', normalizedAnswer);
    console.log('  Is correct:', isCorrect);
  }
  
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

export const getNextStage = (currentStage: GameStage, currentLocation?: Location): GameStage | null => {
  const stages: GameStage[] = ['continent', 'country', 'region', 'city'];
  const currentIndex = stages.indexOf(currentStage);
  
  // Special case: If we're on region stage and region/city have same name,
  // skip to city stage (which will immediately win)
  if (currentStage === 'region' && currentLocation) {
    const normalizedRegion = currentLocation.region.toLowerCase();
    const normalizedCity = currentLocation.city.toLowerCase();
    if (normalizedRegion === normalizedCity) {
      console.log('🎯 Region/City same name detected - skipping to city stage for immediate win');
      return 'city';
    }
  }
  
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
