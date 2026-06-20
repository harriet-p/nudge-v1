import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PIXEL_SCALE } from './constants/pixelScale'

document.documentElement.style.setProperty('--pixel-scale', String(PIXEL_SCALE))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
