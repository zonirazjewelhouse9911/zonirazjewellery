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
  objectFit = 'cover'
}) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (videoRef.current && autoPlay) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          // Pause when scrolled out of view to stop network buffering & save CPU/RAM
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.15
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        background: '#f8f4f0',
        ...style
      }}
    >
      {isInView ? (
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="metadata"
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
          <track kind="captions" src="/empty.vtt" srcLang="en" label="English" default />
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
            background: 'linear-gradient(135deg, #fbf7f4 0%, #ede6df 100%)'
          }}
        />
      )}
    </div>
  );
});

export default LazyVideo;
