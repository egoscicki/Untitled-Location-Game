import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LocationImageProps {
  imageUrl: string;
  city: string;
}

const LocationImage: React.FC<LocationImageProps> = ({ imageUrl, city }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', imageUrl);
    console.error('Error details:', e);
    setIsLoading(false);
    setHasError(true);
  };

  // Log when component mounts
  console.log('🖼️ Attempting to load image for', city, ':', imageUrl);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-gray-600 text-lg">Image unavailable</p>
          <p className="text-gray-500 text-sm">Location: {city}</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>URL: {imageUrl}</p>
            <button 
              onClick={() => window.open(imageUrl, '_blank')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Test URL in new tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading location...</p>
          </div>
        </motion.div>
      )}
      
      <motion.img
        src={imageUrl}
        alt={`Location image`}
        className="location-image w-full h-96 object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Location hint overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0 : 0.8, y: isLoading ? 20 : 0 }}
        className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm"
      >
        📍 Guess this location!
      </motion.div>
    </div>
  );
};

export default LocationImage;
