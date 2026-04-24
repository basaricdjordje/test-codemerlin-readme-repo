import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App.tsx'

const storedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null
const initialTheme: 'light' | 'dark' =
  storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
document.documentElement.dataset.theme = initialTheme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
