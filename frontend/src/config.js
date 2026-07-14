// Base URL for the backend API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zoniraj.in' || 'http://localhost:55000' ;

/**
 * Formats a given file path or URL to point to the backend's upload or public folder.
 * Handles different formats of URLs (absolute, relative with leading slash, relative with upload path).
 * @param {string} url - The URL or path to format
 * @returns {string} The fully qualified URL pointing to the backend
 */
export const getUploadsUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  if (url.startsWith('uploads/')) return `${API_BASE_URL}/${url}`;
  return `${API_BASE_URL}/uploads/${url}`;
};
