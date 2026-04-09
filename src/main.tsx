import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App.tsx'

const saved = localStorage.getItem('app-theme') as 'light' | 'dark' | null
const theme = saved === 'light' || saved === 'dark' ? saved : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
document.documentElement.dataset.theme = theme
document.documentElement.lang = 'en'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
