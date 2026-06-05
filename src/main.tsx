import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'
import { ERROR_MESSAGES } from '@/lib/config'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(ERROR_MESSAGES.rootElementUnavailable)
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
