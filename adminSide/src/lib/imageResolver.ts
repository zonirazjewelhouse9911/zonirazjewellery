/**
 * Centralized Media Resolver for Zoniraz Admin Side
 * Directs all media requests to the dedicated VPS media server (https://media.zoniraz.com/uploads/).
 * Safely handles full URLs, relative paths, legacy mappings, and empty fallbacks without data loss.
 */

export const MEDIA_BASE_URL = 'https://media.zoniraz.com';
export const PRODUCT_IMAGE_PATH = '/images/images/product';
export const FALLBACK_IMAGE = '/images/images/default-image.png';

/**
 * Resolves a product or catalog media filename/path to its full VPS or local static URL.
 * 
 * @param imageName The filename, path, or URL from database/API
 * @param thumbnail Optional flag for thumbnail rendering
 * @returns A sanitized, full VPS or static asset URL
 */
export const resolveProductImage = (imageName: any, _thumbnail = false): string => {
  if (!imageName || typeof imageName !== 'string') return FALLBACK_IMAGE;

  const trimmed = imageName.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  // Case 6a: Handle data URLs or blob URLs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Case 1: Already a complete VPS Media URL (https://media.zoniraz.com/uploads/...)
  if (trimmed.startsWith('https://media.zoniraz.com') || trimmed.startsWith('http://media.zoniraz.com')) {
    return trimmed;
  }

  // Case 4: Safe legacy Cloudinary URL resolution (Verified mapping algorithm without blind string replacement)
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/')) {
    const uploadIdx = trimmed.indexOf('/upload/');
    const pathPart = trimmed.substring(uploadIdx + 8);
    const segs = pathPart.split('/');
    let cleanSegs: string[] = [];
    for (let i = 0; i < segs.length; i++) {
      if (/^v\d+$/.test(segs[i])) {
        cleanSegs = segs.slice(i + 1);
        break;
      } else if (!segs[i].includes(',') && !segs[i].startsWith('w_') && !segs[i].startsWith('c_')) {
        cleanSegs = segs.slice(i);
        break;
      }
    }
    if (cleanSegs.length > 0) {
      return `${MEDIA_BASE_URL}/uploads/${cleanSegs.join('/')}`;
    }
  }

  // Case 6b: Other valid full HTTP/HTTPS external URLs (e.g. Unsplash placeholders in blogs)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Case 2: Relative VPS path (/uploads/example.jpg or uploads/example.jpg)
  if (trimmed.startsWith('/uploads/')) {
    return `${MEDIA_BASE_URL}${trimmed}`;
  }
  if (trimmed.startsWith('uploads/')) {
    return `${MEDIA_BASE_URL}/${trimmed}`;
  }

  // Handle local app assets (/images/...)
  if (
    trimmed.startsWith('/images/products/') || 
    trimmed.startsWith('/images/blogs/') || 
    trimmed.startsWith('/images/misc/') ||
    trimmed.startsWith('/videos/')
  ) {
    return trimmed;
  }

  // Case 3: Relative filename/path under zoniraz storage directory (zoniraz/example.jpg)
  if (trimmed.startsWith('zoniraz/') || trimmed.startsWith('/zoniraz/')) {
    const clean = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    return `${MEDIA_BASE_URL}/uploads/${clean}`;
  }

  // Handle existing relative paths
  if (trimmed.startsWith('/')) {
    if (trimmed.includes(PRODUCT_IMAGE_PATH)) return trimmed;
    return `${PRODUCT_IMAGE_PATH}${trimmed}`;
  }

  // Handle filename-only mapping
  const normalizedName = trimmed.replace(/\s+/g, '-');
  return `${PRODUCT_IMAGE_PATH}/${normalizedName}`;
};

