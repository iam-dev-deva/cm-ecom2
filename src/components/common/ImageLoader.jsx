import { LoadingOutlined } from '@ant-design/icons';
import PropType from 'prop-types';
import React, { useState } from 'react';

// Persist loaded image state across component instances
const loadedImages = {};

const ImageLoader = ({ src, alt, className='image-loader' }) => {
  const [loaded, setLoaded] = useState(!!loadedImages[src]);

  const onLoad = () => {
    loadedImages[src] = true;
    setLoaded(true);
  };

  const onError = (e) => {
    // mark as loaded to hide loader, keep broken image styling
    loadedImages[src] = true;
    setLoaded(true);
    // optionally remove src to avoid repeated failed requests
    // e.target.src = '';
  };

  return (
    <>
      {!loaded && (
        <LoadingOutlined style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto'
        }}
        />
      )}
      <img
        alt={alt || ''}
        className={`${className || ''} ${loaded ? 'is-img-loaded' : 'is-img-loading'}`}
        onLoad={onLoad}
        onError={onError}
        src={src}
        loading="lazy"
        decoding="async"
      />
    </>
  );
};

ImageLoader.propTypes = {
  src: PropType.string.isRequired,
  alt: PropType.string,
  className: PropType.string
};

export default ImageLoader;
