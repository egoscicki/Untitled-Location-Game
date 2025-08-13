import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LocationImageProps {
  imageUrl: string;
  city: string;
}

const LocationImage: React.FC<LocationImageProps> = ({ imageUrl, city }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Check if this is a Google Street View image
  const isStreetView = imageUrl.includes('maps.googleapis.com/maps/api/streetview');

  useEffect(() => {
    if (isStreetView) {
      setIsInteractive(true);
    }
  }, [isStreetView]);

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

  const rotateView = (direction: 'left' | 'right') => {
    if (!isStreetView) return;
    
    const newHeading = direction === 'left' 
      ? (currentHeading - 90) % 360 
      : (currentHeading + 90) % 360;
    
    setCurrentHeading(newHeading);
    
    // Update the image URL with new heading
    const baseUrl = imageUrl.split('&heading=')[0];
    const newImageUrl = `${baseUrl}&heading=${newHeading}`;
    
    if (imageRef.current) {
      imageRef.current.src = newImageUrl;
    }
  };

  const handleImageClick = () => {
    if (!isStreetView) return;
    rotateView('right');
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-gray-600 text-lg">Image unavailable</p>
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
        ref={imageRef}
        src={imageUrl}
        alt={`Location image`}
        className={`location-image w-full h-96 object-cover ${isInteractive ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={handleImageClick}
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

      {/* Rotation controls for Street View */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          className="absolute top-4 right-4 flex space-x-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateView('left');
            }}
            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            title="Rotate left"
          >
            ↶
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateView('right');
            }}
            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            title="Rotate right"
          >
            ↷
          </button>
        </motion.div>
      )}

      {/* Interactive hint */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 0.8 }}
          className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm"
        >
          🔄 Click to rotate view
        </motion.div>
      )}
    </div>
  );
};

export default LocationImage;
