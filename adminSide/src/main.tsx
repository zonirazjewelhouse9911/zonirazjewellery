import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Base URL for the backend API
export const BACKEND_URL = (
  import.meta.env.VITE_API_URL || 'https://lightpink-locust-700517.hostingersite.com'
).replace(/\/+$/, '');

// Global Fetch Interceptor to route relative API calls to backend in production
// and strictly rewrite any legacy onrender.com requests to the Hostinger backend
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string') {
    // Intercept and redirect any accidental onrender.com call
    if (input.includes('onrender.com')) {
      input = input.replace(/https?:\/\/[^/]*onrender\.com/, BACKEND_URL);
    }
    if (input.startsWith('/api')) {
      // Note: We check if it is not localhost to rewrite to production backend
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (!isLocalhost) {
        input = `${BACKEND_URL}${input}`;
      }
    }
  } else if (input instanceof Request && input.url && input.url.includes('onrender.com')) {
    const newUrl = input.url.replace(/https?:\/\/[^/]*onrender\.com/, BACKEND_URL);
    input = new Request(newUrl, input);
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
