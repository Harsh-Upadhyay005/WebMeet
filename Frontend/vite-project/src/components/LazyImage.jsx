import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  fallbackSrc = null
}) => {
  // Automatically trigger loading if there's a src, skip unnecessary delay hooks
  const initialSrc = src || fallbackSrc || '';
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [status, setStatus] = useState(initialSrc ? 'loading' : 'idle');

  // If the parent changes `src` quickly (e.g. searching), ensure we update
  if (src && currentSrc !== src && currentSrc !== fallbackSrc) {
    setCurrentSrc(src);
    setStatus('loading');
  }

  if (!initialSrc) {
    return null;
  }

  const isLoading = status === 'loading';

  if (status === 'error') {
    return (
      <div className={`flex items-center justify-center bg-base-200 ${placeholderClassName || className}`}>
        <Camera className="size-8 text-base-content opacity-40" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${placeholderClassName || className}`}>
      {/* Hide the spinner for small avatars if we want to, but keep it for normal images */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200/50">
          <span className="loading loading-spinner text-primary w-4 h-4 sm:w-6 sm:h-6"></span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(event) => {
          setStatus('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setStatus('loading');
            return;
          }
          setStatus('error');
          onError?.(event);
        }}
        className={`${className} ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      />
    </div>
  );
};

export default LazyImage;
