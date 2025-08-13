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

  constructor() {
    // For prototype, using a placeholder. In production, get from environment variables
    this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
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
    // For prototype, return a placeholder. In production, use actual Street View API
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&key=${this.apiKey}`;
  }
}

export const placesApiService = new PlacesApiService();
