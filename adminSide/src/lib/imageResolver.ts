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
export const resolveProductImage = (imageName: any): string => {
  if (!imageName || typeof imageName !== 'string') return FALLBACK_IMAGE;

  const trimmed = imageName.trim();
  if (!trimmed) return FALLBACK_IMAGE;

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
    // If it doesn't start with / but starts with uploads/, prefix it
    if (trimmed.startsWith('uploads/')) {
      return `/${trimmed}`;
    }
    return trimmed;
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
