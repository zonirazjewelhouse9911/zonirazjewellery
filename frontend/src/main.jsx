import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Remove the SEO prerender container immediately prior to client React hydration
// This guarantees zero hydration mismatches because React only controls #root
const prerenderEl = document.getElementById('zoniraz-seo-prerender');
if (prerenderEl) {
  prerenderEl.remove();
}

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
