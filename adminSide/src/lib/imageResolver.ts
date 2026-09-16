/**
 * Centralized Product Image Resolver for Zoniraz (React.js version)
 * Handles legacy image library paths, filename normalization, and fallback logic.
 */

export const PRODUCT_IMAGE_PATH = '/images/images/product';
export const FALLBACK_IMAGE = '/images/images/default-image.png';

/**
 * Resolves a product image filename to its local static path.
 * 
 * @param imageName The filename or path from MongoDB
 * @returns A sanitized, local static path or the fallback
 */
export const resolveProductImage = (imageName: any, thumbnail = false): string => {
  if (!imageName || typeof imageName !== 'string') return FALLBACK_IMAGE;

  const trimmed = imageName.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  // Cloudinary thumbnail delivery optimization (~97% payload reduction)
  if (thumbnail && trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    if (!trimmed.includes('/image/upload/w_') && !trimmed.includes('/image/upload/c_')) {
      return trimmed.replace('/image/upload/', '/image/upload/w_200,h_200,c_fill,q_auto,f_auto/');
    }
  }

  // 1. Handle full URLs or data URLs (external or existing)
  if (trimmed.startsWith('http') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 2. Handle new storage paths that are already correct (including uploads)
  if (
    trimmed.startsWith('/images/products/') || 
    trimmed.startsWith('/images/blogs/') || 
    trimmed.startsWith('/images/misc/') ||
    trimmed.startsWith('/videos/') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('uploads/')
  ) {
    let resolved = trimmed;
    if (trimmed.startsWith('uploads/')) {
      resolved = `/${trimmed}`;
    }
    
    if (resolved.startsWith('/uploads/')) {
      return `https://media.zoniraz.com${resolved}`;
    }
    return resolved;
  }

  // 3. Handle already resolved paths (starting with /)
  if (trimmed.startsWith('/')) {
    if (trimmed.includes(PRODUCT_IMAGE_PATH)) return trimmed;
    return `${PRODUCT_IMAGE_PATH}${trimmed}`;
  }

  // 4. Handle filename-only mapping
  const normalizedName = trimmed.replace(/\s+/g, '-');
  return `${PRODUCT_IMAGE_PATH}/${normalizedName}`;
};
