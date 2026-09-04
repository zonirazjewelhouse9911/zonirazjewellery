import React, { useState, useEffect, useRef, memo } from 'react';

const LazyVideo = memo(function LazyVideo({
  src,
  webm,
  poster,
  className = '',
  style = {},
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  objectFit = 'cover'
}) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      {isInView ? (
        <video
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          poster={poster}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            display: 'block'
          }}
        >
          {webm && <source src={webm} type="video/webm" />}
          {src && <source src={src} type="video/mp4" />}
          <track kind="captions" src="https://res.cloudinary.com/fxokwlyu/raw/upload/v1788498402/zoniraz_frontend/empty.vtt" srcLang="en" label="English" default />
        </video>
      ) : poster ? (
        <img
          src={poster}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            display: 'block'
          }}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5efed'
          }}
        />
      )}
    </div>
  );
});

export default LazyVideo;
