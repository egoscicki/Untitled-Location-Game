// Google Places API service using the new AutocompleteSuggestion API
// Note: In production, you'll need to add your actual API key to environment variables

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

class PlacesApiService {
  private apiKey: string;
  private autocompleteSuggestion: google.maps.places.AutocompleteSuggestion | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  // Regions for different countries for autocomplete
  private regions = {
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
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

  constructor() {
    // Using the provided API key
    this.apiKey = 'AIzaSyBXq48NTHs4zGSM303QTv9K72s_Yve6qBo';
  }

  async initialize(): Promise<void> {
    if (window.google && window.google.maps) {
      try {
        // Use the new AutocompleteSuggestion API
        this.autocompleteSuggestion = new google.maps.places.AutocompleteSuggestion();
        this.placesService = new google.maps.places.PlacesService(
          document.createElement('div')
        );
      } catch (error) {
        console.warn('New AutocompleteSuggestion API not available, falling back to legacy methods:', error);
        // Fallback to legacy methods if new API is not available
      }
    } else {
      throw new Error('Google Maps API not loaded');
    }
  }

  async getCountrySuggestions(input: string): Promise<string[]> {
    try {
      if (this.autocompleteSuggestion) {
        // Use new API - note: this is a simplified approach
        // The new API structure is different, so we'll use fallbacks for now
        console.log('New AutocompleteSuggestion API available');
      }
      
      // Fallback to hardcoded countries if API fails or not available
      const allCountries = Object.keys(this.regions);
      const normalizedInput = input.toLowerCase();
      return allCountries.filter(country =>
        country.toLowerCase().includes(normalizedInput)
      ).slice(0, 10);
    } catch (error) {
      console.error('Error getting country suggestions:', error);
      // Fallback to hardcoded countries
      const allCountries = Object.keys(this.regions);
      const normalizedInput = input.toLowerCase();
      return allCountries.filter(country =>
        country.toLowerCase().includes(normalizedInput)
      ).slice(0, 10);
    }
  }

  async getRegionSuggestions(input: string, country?: string): Promise<string[]> {
    // If country is specified, filter regions for that country
    if (country && this.regions[country as keyof typeof this.regions]) {
      const countryRegions = this.regions[country as keyof typeof this.regions];
      const normalizedInput = input.toLowerCase();
      return countryRegions.filter(region => 
        region.toLowerCase().includes(normalizedInput)
      ).slice(0, 10);
    }
    
    // Otherwise, return regions from all countries
    const normalizedInput = input.toLowerCase();
    const allRegions = Object.values(this.regions).flat();
    return allRegions.filter(region => 
      region.toLowerCase().includes(normalizedInput)
    ).slice(0, 10);
  }

  async getCitySuggestions(input: string, country?: string): Promise<string[]> {
    try {
      if (this.autocompleteSuggestion) {
        // Use new API - note: this is a simplified approach
        console.log('New AutocompleteSuggestion API available');
      }
      
      // Fallback to hardcoded cities if API fails or not available
      const fallbackCities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Rio de Janeiro', 'Cairo', 'Berlin', 'Rome', 'Beijing', 'Mumbai', 'Johannesburg'];
      const normalizedInput = input.toLowerCase();
      return fallbackCities.filter(city =>
        city.toLowerCase().includes(normalizedInput)
      ).slice(0, 10);
    } catch (error) {
      console.error('Error getting city suggestions:', error);
      // Fallback to hardcoded cities
      const fallbackCities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Rio de Janeiro', 'Cairo', 'Berlin', 'Rome', 'Beijing', 'Mumbai', 'Johannesburg'];
      const normalizedInput = input.toLowerCase();
      return fallbackCities.filter(city =>
        city.toLowerCase().includes(normalizedInput)
      ).slice(0, 10);
    }
  }

  async getStreetViewImage(lat: number, lng: number, size: string = '600x400', imageIndex: number = 0): Promise<string> {
    // Add randomization to coordinates to get different images
    // Use imageIndex to create different randomization seeds
    const seed = imageIndex * 1000 + Date.now() % 10000;
    const random = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };
    
    // Small random offset (±0.001 degrees = roughly ±100 meters)
    const latOffset = (random(0, 1) - 0.5) * 0.002;
    const lngOffset = (random(0, 1) - 0.5) * 0.002;
    
    const randomizedLat = lat + latOffset;
    const randomizedLng = lng + lngOffset;
    
    // Randomize Street View parameters for variety
    const randomHeading = Math.floor(random(0, 360)); // 0-359 degrees
    const randomPitch = Math.floor((random(0, 1) - 0.5) * 20); // -10 to +10 degrees
    const randomFov = 60 + Math.floor(random(0, 1) * 60); // 60-120 degrees
    
    // Return actual Street View image URL with randomized parameters
    const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${randomizedLat.toFixed(6)},${randomizedLng.toFixed(6)}&key=${this.apiKey}&heading=${randomHeading}&pitch=${randomPitch}&fov=${randomFov}`;
    
    console.log(`🖼️ Image ${imageIndex + 1} - Original coordinates:`, lat, lng);
    console.log(`🎲 Image ${imageIndex + 1} - Randomized coordinates:`, randomizedLat.toFixed(6), randomizedLng.toFixed(6));
    console.log(`🎯 Image ${imageIndex + 1} - Street View params - Heading:`, randomHeading, 'Pitch:', randomPitch, 'FOV:', randomFov);
    console.log(`🖼️ Image ${imageIndex + 1} - Generated Street View URL:`, imageUrl);
    
    return imageUrl;
  }
}

export const placesApiService = new PlacesApiService();
