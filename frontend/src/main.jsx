import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Automatically reload page when a dynamic chunk fails to load due to a new deployment version
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Vite] Dynamic chunk preload error detected (version mismatch). Auto-reloading page...', event);
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
