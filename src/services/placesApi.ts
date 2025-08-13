// Google Places API service
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
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  // Regions for different countries for autocomplete
  private regions = {
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Channel Islands', 'Isle of Man'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Normandie', 'Pays de la Loire'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka', 'Aichi', 'Kanagawa', 'Saitama', 'Chiba', 'Hyogo'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada', 'Dahab', 'Siwa', 'Marsa Alam']
  };

  constructor() {
    // Using the provided API key
    this.apiKey = 'AIzaSyBXq48NTHs4zGSM303QTv9K72s_Yve6qBo';
  }

  async initialize(): Promise<void> {
    if (window.google && window.google.maps) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );
    } else {
      throw new Error('Google Maps API not loaded');
    }
  }

  async getCountrySuggestions(input: string): Promise<string[]> {
    if (!this.autocompleteService) {
      throw new Error('Autocomplete service not initialized');
    }

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        types: ['country'],
        componentRestrictions: { country: [] }
      };

      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        this.autocompleteService!.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });

      return response.map(prediction => prediction.structured_formatting.main_text);
    } catch (error) {
      console.error('Error getting country suggestions:', error);
      return [];
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
    if (!this.autocompleteService) {
      throw new Error('Autocomplete service not initialized');
    }

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        types: ['(cities)'],
        componentRestrictions: country ? { country: [country] } : undefined
      };

      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        this.autocompleteService!.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });

      return response.map(prediction => prediction.structured_formatting.main_text);
    } catch (error) {
      console.error('Error getting city suggestions:', error);
      return [];
    }
  }

  async getStreetViewImage(lat: number, lng: number, size: string = '600x400'): Promise<string> {
    // Return actual Street View image URL with the API key
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&key=${this.apiKey}`;
  }
}

export const placesApiService = new PlacesApiService();
