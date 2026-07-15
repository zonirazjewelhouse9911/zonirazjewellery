import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Fetch Interceptor to route relative API calls to Render backend in production
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('/api')) {
    // Note: We check if it is not localhost to rewrite to production backend
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (!isLocalhost) {
      input = `https://zonirazjewellery.onrender.com${input}`;
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
