// Base URL for the backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:55000'
    : 'https://zonirazjewellery.onrender.com');

/**
 * Formats a given file path or URL to point to the backend's upload or public folder.
 * Handles different formats of URLs (absolute, relative with leading slash, relative with upload path).
 * @param {string} url - The URL or path to format
 * @returns {string} The fully qualified URL pointing to the backend
 */
export const getUploadsUrl = (url, width) => {
  if (!url) return '';
  let formatted = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.startsWith('/')) formatted = `${API_BASE_URL}${url}`;
    else if (url.startsWith('uploads/')) formatted = `${API_BASE_URL}/${url}`;
    else formatted = `${API_BASE_URL}/uploads/${url}`;
  }
  if (formatted.includes('res.cloudinary.com') && formatted.includes('/upload/')) {
    const params = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';
    return formatted.replace('/upload/', `/upload/${params}/`);
  }
  return formatted;
};