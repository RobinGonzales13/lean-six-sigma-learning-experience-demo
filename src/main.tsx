import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Scale the UI to the viewport: up to 130%, shrinking on smaller screens so nothing needs scrolling.
function fitZoom() {
  const zoom = Math.min(1.3, Math.max(0.5, Math.min(window.innerWidth / 1100, window.innerHeight / 760)))
  document.documentElement.style.setProperty('--ui-zoom', zoom.toFixed(3))
}
fitZoom()
window.addEventListener('resize', fitZoom)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
