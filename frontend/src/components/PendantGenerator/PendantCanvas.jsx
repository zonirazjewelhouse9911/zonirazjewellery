import React, { useEffect, useRef, useState } from 'react';
import { LETTER_CALIBRATION } from './pendantCalibration';

// In-memory image cache to ensure instant keystroke composition without re-fetching
const imageCache = new Map();

const loadImage = (url) => {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url));
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

/**
 * Measure actual non-transparent gold pixel bounds (left, right, top, bottom) of a letter PNG image.
 * Bypasses transparent padding margins so gold edges touch with 0 GAP and sit on the EXACT SAME bottom baseline.
 */
const getLetterPixelBounds = (img, width, height) => {
  try {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, width, height);

    const imgData = tempCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let minX = width, maxX = 0;
    let minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 25) { // Non-transparent gold pixel
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX > maxX) {
      minX = 0;
      maxX = width - 1;
      minY = 0;
      maxY = height - 1;
    }

    const leftMargin = minX;
    const rightMargin = width - (maxX + 1);
    const topMargin = minY;
    const bottomMargin = height - (maxY + 1);
    const realGoldWidth = maxX - minX + 1;

    return { leftMargin, rightMargin, topMargin, bottomMargin, realGoldWidth };
  } catch (e) {
    return { leftMargin: 0, rightMargin: 0, topMargin: 0, bottomMargin: 0, realGoldWidth: width };
  }
};

/**
 * PendantCanvas - Ultra-High Precision Standalone Jewelry Renderer
 * Automatically detects real gold pixel bounds to eliminate transparent PNG margins,
 * connecting letters with ZERO GAP along one shared bottom baseline.
 */
export default function PendantCanvas({
  resolvedData,
  bgColor = '#faf7f5',
  customScale = 1,
  angle = 'front',
  material = 'gold_18k'
}) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [drawError, setDrawError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!resolvedData || !resolvedData.success || !resolvedData.letters.length) {
      return;
    }

    setLoading(true);
    setDrawError(null);

    // Preload all Cloudinary letter images in parallel
    const loadPromises = resolvedData.letters.map((item) => loadImage(item.url));

    Promise.all(loadPromises)
      .then((loadedImages) => {
        if (!isMounted) return;
        setLoading(false);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // 1. Target Heights: First Letter Bigger (160px), Small Letters Smaller (100px)
        const capitalHeight = Math.round(160 * customScale);
        const smallHeight = Math.round(100 * customScale);
        const bottomBaseline = capitalHeight + Math.round(20 * customScale); // Shared bottom baseline

        // Calculate per-letter render dimensions preserving natural aspect ratio
        const letterBoxes = resolvedData.letters.map((item, idx) => {
          const img = loadedImages[idx];
          const aspect = img.width / img.height;
          const isCapital = (item.positionRole === 'first' || item.positionRole === 'single');

          const calib = isCapital
            ? (LETTER_CALIBRATION.capital[item.letter] || LETTER_CALIBRATION.capital)
            : (LETTER_CALIBRATION.small[item.letter] || LETTER_CALIBRATION.small);

          const renderHeight = Math.round((calib.baseHeight || (isCapital ? 160 : 100)) * customScale);
          const renderWidth = Math.round(renderHeight * aspect);
          const bounds = getLetterPixelBounds(img, renderWidth, renderHeight);

          return {
            img,
            letter: item.letter,
            role: item.positionRole,
            width: renderWidth,
            height: renderHeight,
            isCapital,
            calib,
            bounds
          };
        });

        // 2. Position ALL letters so lowest gold pixel touches bottomBaseline EXACTLY
        const placedLetters = [];

        letterBoxes.forEach((box, i) => {
          // Align lowest non-transparent gold pixel flush to bottomBaseline
          const y = bottomBaseline - box.height + box.bounds.bottomMargin;

          let x = 0;
          if (i === 0) {
            x = 0;
          } else {
            const prev = placedLetters[i - 1];
            // Previous gold pixel end X coordinate
            const prevGoldEndX = prev.x + (prev.width - prev.bounds.rightMargin);
            // Current letter X positioned so its first gold pixel touches previous gold end minus 2px overlap!
            const overlapAmount = Math.round(2 * customScale);
            x = prevGoldEndX - box.bounds.leftMargin - overlapAmount;
          }

          placedLetters.push({
            ...box,
            x,
            y
          });
        });

        // 3. Compute overall bounding box across ALL placed letters
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        placedLetters.forEach(item => {
          minX = Math.min(minX, item.x);
          minY = Math.min(minY, item.y);
          maxX = Math.max(maxX, item.x + item.width);
          maxY = Math.max(maxY, item.y + item.height);
        });

        const composedWidth = maxX - minX;
        const composedHeight = maxY - minY;

        // 4. Setup Internal Canvas Coordinates
        const paddingX = 70;
        const paddingY = 70;
        const canvasWidth = Math.max(500, Math.round(composedWidth + paddingX * 2));
        const canvasHeight = Math.max(300, Math.round(composedHeight + paddingY * 2));

        // 2x Retina DPI Resolution for ultra-crisp render
        canvas.width = canvasWidth * 2;
        canvas.height = canvasHeight * 2;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        ctx.scale(2, 2);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Render Canvas Background Container
        if (bgColor && bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // 5. Shift & Auto-Center the COMPLETE Composed Pendant Bounding Box
        const offsetX = Math.round((canvasWidth - composedWidth) / 2) - minX;
        const offsetY = Math.round((canvasHeight - composedHeight) / 2) - minY;

        ctx.save();

        // Multi-Angle Perspective Transforms
        if (angle === 'side_left' || angle === 'side_right') {
          ctx.translate(canvasWidth / 2, canvasHeight / 2);
          ctx.scale(0.18, 1);
          ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        } else if (angle === 'top') {
          ctx.translate(canvasWidth / 2, canvasHeight / 2);
          ctx.scale(1, 0.22);
          ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        } else if (angle === 'angled') {
          ctx.translate(canvasWidth / 2, canvasHeight / 2);
          ctx.transform(0.88, -0.15, 0.12, 0.88, 0, 0);
          ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        }

        // 6. Draw Clean Mirrored Reflection using exact same letter position data
        const sharedBottomY = Math.round(bottomBaseline + offsetY);

        ctx.save();
        placedLetters.forEach((item) => {
          const itemX = Math.round(item.x + offsetX);

          ctx.save();
          ctx.translate(itemX, sharedBottomY + 2);
          ctx.scale(1, -0.36); // Flip vertically with 36% height
          ctx.globalAlpha = 0.15; // 15% reflection opacity
          ctx.drawImage(item.img, 0, 0, item.width, item.height);
          ctx.restore();
        });

        // Alpha fade mask erasing reflection bottom smoothly into background
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        const maskGrad = ctx.createLinearGradient(0, sharedBottomY, 0, sharedBottomY + 40);
        maskGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        maskGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = maskGrad;
        ctx.fillRect(0, sharedBottomY, canvasWidth, 50);
        ctx.restore();

        ctx.restore();

        // 7. Draw Main Composed Standalone Jewelry Letter Assets
        placedLetters.forEach((item) => {
          const itemX = Math.round(item.x + offsetX);
          const itemY = Math.round(item.y + offsetY);
          ctx.drawImage(item.img, itemX, itemY, item.width, item.height);

          // Apply Pavé Diamond Sparkle Overlay if Diamond Material Selected
          if (material === 'diamond') {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            for (let dX = 12; dX < item.width - 12; dX += 14) {
              for (let dY = 14; dY < item.height - 14; dY += 14) {
                if ((dX + dY) % 3 === 0) {
                  ctx.beginPath();
                  ctx.arc(itemX + dX, itemY + dY, 1.4, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
            ctx.restore();
          }
        });

        ctx.restore();
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error rendering name pendant canvas:', err);
        setLoading(false);
        setDrawError('Failed to load letter images from Cloudinary CDN.');
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedData, bgColor, customScale, angle, material]);

  if (!resolvedData || !resolvedData.success) {
    return (
      <div style={{
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf7f5',
        borderRadius: '16px',
        border: '1px dashed #d4c5bd',
        color: '#746380',
        fontSize: '13px',
        padding: '20px',
        textAlign: 'center'
      }}>
        {resolvedData?.error || 'Enter a name above to preview your custom pendant'}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(250, 247, 245, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          zIndex: 5,
          fontSize: '12px',
          fontWeight: '600',
          color: '#2b221d'
        }}>
          ⚡ Loading Cloudinary Jewelry Assets...
        </div>
      )}

      {drawError ? (
        <div style={{ padding: '20px', color: '#c5221f', fontSize: '13px' }}>{drawError}</div>
      ) : (
        <div style={{
          overflowX: 'auto',
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: bgColor,
          borderRadius: '20px',
          border: '1px solid #e5dedb',
          padding: '20px'
        }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
}
