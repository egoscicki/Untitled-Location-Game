import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
  onLoad?: () => void;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        setIsLoaded(true);
        onLoad?.();
      } catch (err) {
        console.error('Failed to load Google Maps API:', err);
        setError('Failed to load Google Maps API');
      }
    };

    loadGoogleMaps();
  }, [onLoad]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">API Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your Google Maps API key configuration
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;
