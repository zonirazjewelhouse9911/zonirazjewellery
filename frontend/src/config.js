// Base URL for the backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:55000'
    : 'https://zonirazjewellery.onrender.com');

// Base URL for the dedicated Media Server (Hostinger VPS)
export const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_URL || 'https://media.zoniraz.com';

/**
 * Formats a given file path or URL to point to the dedicated media server or backend's upload folder.
 * Handles different formats of URLs (absolute, relative with leading slash, relative with upload path).
 * @param {string} url - The URL or path to format
 * @param {number|string} [width] - Optional width parameter for responsive delivery
 * @returns {string} The fully qualified URL
 */
export const getUploadsUrl = (url, width) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.startsWith('/src/') || url.startsWith('/@fs/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  let formatted = url.trim();

  // If already pointing to media.zoniraz.com or full URL
  if (formatted.startsWith('https://media.zoniraz.com') || formatted.startsWith('http://media.zoniraz.com')) {
    return formatted;
  }

  // Handle relative paths
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    if (formatted.startsWith('/uploads/')) formatted = `${MEDIA_BASE_URL}${formatted}`;
    else if (formatted.startsWith('uploads/')) formatted = `${MEDIA_BASE_URL}/${formatted}`;
    else if (formatted.startsWith('/')) formatted = `${API_BASE_URL}${formatted}`;
    else formatted = `${MEDIA_BASE_URL}/uploads/${formatted}`;
  }

  // Handle any remaining legacy Cloudinary URL transformation
  if (formatted.includes('res.cloudinary.com') && formatted.includes('/upload/')) {
    const uploadIdx = formatted.indexOf('/upload/');
    let pathPart = formatted.substring(uploadIdx + 8);
    const segs = pathPart.split('/');
    let cleanSegs = [];
    for (let i = 0; i < segs.length; i++) {
      if (/^v\d+$/.test(segs[i])) {
        cleanSegs = segs.slice(i + 1);
        break;
      } else if (!segs[i].includes(',') && !segs[i].startsWith('w_') && !segs[i].startsWith('c_')) {
        cleanSegs = segs.slice(i);
        break;
      }
    }
    return `${MEDIA_BASE_URL}/uploads/${cleanSegs.join('/')}`;
  }

  return formatted;
};