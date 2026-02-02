import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  onLoad,
  onError,
  fallbackSrc = null
}) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      return;
    }

    let isMounted = true;

    // Preload the image
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (isMounted) {
        setLoadedSrc(src);
        setError(false);
        onLoad?.();
      }
    };

    img.onerror = () => {
      if (isMounted) {
        if (fallbackSrc) {
          setLoadedSrc(fallbackSrc);
          setError(false);
        } else {
          setLoadedSrc(null);
          setError(true);
        }
        onError?.();
      }
    };

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, onLoad, onError]);

  // Show loading spinner while image is being loaded
  const isLoading = src && !loadedSrc && !error;
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${placeholderClassName || className}`}>
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex items-center justify-center ${placeholderClassName || className}`}>
        <Camera className="size-8 text-base-content opacity-40" />
      </div>
    );
  }

  // Show image
  if (loadedSrc) {
    return (
      <img
        src={loadedSrc}
        alt={alt}
        className={className}
      />
    );
  }

  // No src provided
  return null;
};

export default LazyImage;
