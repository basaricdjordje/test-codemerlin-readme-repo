import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ThemeProvider } from './contexts/ThemeContext'
import { ContactForm } from './components/ContactForm'
import { LanguageSelector } from './components/LanguageSelector'
import { Settings } from './components/Settings'
import './App.css'

function AppContent() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)
  const [currentView, setCurrentView] = useState<'home' | 'settings'>(() =>
    typeof window !== 'undefined' && window.location.hash === '#settings' ? 'settings' : 'home'
  )

  useEffect(() => {
    const handler = () => {
      setCurrentView(window.location.hash === '#settings' ? 'settings' : 'home')
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return (
    <>
      <main id="main-content" tabIndex={-1}>
      <LanguageSelector />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{t('app.title')}</h1>
      <p className="welcome-message">{t('app.welcome')}</p>
      <div className="search-bar">
        <input
          type="search"
          placeholder={t('common.search')}
          aria-label={t('common.search')}
        />
      </div>
      <nav>
        <a href="#home">{t('navigation.home')}</a>
        <a href="#settings">{t('navigation.settings')}</a>
        <a href="#profile">{t('navigation.profile')}</a>
        <button type="button">{t('navigation.logout')}</button>
      </nav>
      {currentView === 'settings' ? (
        <Settings />
      ) : (
        <>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              {t('app.countIs', { count })}
            </button>
            <p>
              <button type="button">{t('common.save')}</button>
              <button type="button">{t('common.cancel')}</button>
            </p>
          </div>
          <p className="read-the-docs">
            {t('common.loading')}
          </p>
          <ContactForm />
        </>
      )}
      </main>
      <a href="#main-content" className="back-to-top">{t('app.backToTop')}</a>
      <footer className="app-footer">
        {t('app.footer')} · {t('app.version', { version: '0.1.0' })}
      </footer>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
