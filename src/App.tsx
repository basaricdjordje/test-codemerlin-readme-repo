import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ThemeProvider } from './contexts/ThemeContext'
import { ContactForm } from './components/ContactForm'
import { LanguageSelector } from './components/LanguageSelector'
import { OfflineIndicator } from './components/OfflineIndicator'
import { Profile } from './components/Profile'
import { Settings } from './components/Settings'
import { useDebounce } from './hooks/useDebounce'
import { matchesSearch } from './utils/search'
import './App.css'

const SEARCH_DEBOUNCE_MS = 300

function AppContent() {
  const { t, i18n } = useTranslation()
  const mainRef = useRef<HTMLElement>(null)
  const [count, setCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)
  const [currentView, setCurrentView] = useState<'home' | 'settings' | 'profile'>(() => {
    if (typeof window === 'undefined') return 'home'
    const hash = window.location.hash
    if (hash === '#settings') return 'settings'
    if (hash === '#profile') return 'profile'
    return 'home'
  })

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash
      if (hash === '#settings') setCurrentView('settings')
      else if (hash === '#profile') setCurrentView('profile')
      else setCurrentView('home')
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useEffect(() => {
    const lng = i18n.resolvedLanguage ?? i18n.language
    document.documentElement.lang = lng.startsWith('sr') ? 'sr' : 'en'
  }, [i18n.language, i18n.resolvedLanguage])

  const focusMain = () => {
    mainRef.current?.focus()
  }

  const sectionMatches = useMemo(() => {
    const title = t('app.title')
    const welcome = t('app.welcome')
    const nav = [t('navigation.home'), t('navigation.settings'), t('navigation.profile'), t('navigation.logout')]
    const card = [t('app.countIs', { count }), t('common.save'), t('common.cancel')]
    const loading = t('common.loading')
    const form = [t('form.title'), t('form.name'), t('form.email')]
    const settings = [t('settings.title'), t('settings.theme'), t('app.lightMode'), t('app.darkMode')]
    const profile = [t('profile.title'), t('profile.displayName'), t('profile.theme'), t('profile.language')]
    const footer = [t('app.footer'), t('app.version', { version: '0.1.0' })]

    return {
      header: matchesSearch([title], debouncedQuery),
      welcome: matchesSearch([welcome], debouncedQuery),
      nav: matchesSearch(nav, debouncedQuery),
      card: matchesSearch(card, debouncedQuery),
      loading: matchesSearch([loading], debouncedQuery),
      form: matchesSearch(form, debouncedQuery),
      settings: matchesSearch(settings, debouncedQuery),
      profile: matchesSearch(profile, debouncedQuery),
      footer: matchesSearch(footer, debouncedQuery),
    }
  }, [debouncedQuery, count, t])

  const hasAnyMatch = useMemo(
    () =>
      sectionMatches.header ||
      sectionMatches.welcome ||
      sectionMatches.nav ||
      sectionMatches.card ||
      sectionMatches.loading ||
      sectionMatches.form ||
      sectionMatches.settings ||
      sectionMatches.profile ||
      sectionMatches.footer,
    [sectionMatches]
  )

  const showNoResults = debouncedQuery.trim().length > 0 && !hasAnyMatch

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          focusMain()
        }}
      >
        {t('app.skipToMain')}
      </a>
      <OfflineIndicator />
      <main ref={mainRef} id="main-content" tabIndex={-1}>
      <LanguageSelector />
      {(sectionMatches.header || !debouncedQuery.trim()) && (
        <div>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      )}
      {(sectionMatches.header || !debouncedQuery.trim()) && <h1>{t('app.title')}</h1>}
      {(sectionMatches.welcome || !debouncedQuery.trim()) && (
        <p className="welcome-message">{t('app.welcome')}</p>
      )}
      <div className="search-bar">
        <span id="search-description" className="visually-hidden">
          {t('search.ariaDescription')}
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('common.search')}
          aria-describedby={
            showNoResults ? 'search-description search-no-results' : 'search-description'
          }
        />
      </div>
      {showNoResults && (
        <p id="search-no-results" className="search-no-results" role="status">
          {t('search.noResults')}
        </p>
      )}
      {(sectionMatches.nav || !debouncedQuery.trim()) && (
        <nav aria-label={t('navigation.primaryNav')}>
          <a href="#home">{t('navigation.home')}</a>
          <a href="#settings">{t('navigation.settings')}</a>
          <a href="#profile">{t('navigation.profile')}</a>
          <button type="button">{t('navigation.logout')}</button>
        </nav>
      )}
      {currentView === 'settings' ? (
        (sectionMatches.settings || !debouncedQuery.trim()) && <Settings />
      ) : currentView === 'profile' ? (
        (sectionMatches.profile || !debouncedQuery.trim()) && <Profile />
      ) : (
        <>
          {(sectionMatches.card || !debouncedQuery.trim()) && (
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                {t('app.countIs', { count })}
              </button>
              <p>
                <button type="button">{t('common.save')}</button>
                <button type="button">{t('common.cancel')}</button>
              </p>
            </div>
          )}
          {(sectionMatches.loading || !debouncedQuery.trim()) && (
            <p className="read-the-docs">
              {t('common.loading')}
            </p>
          )}
          {(sectionMatches.form || !debouncedQuery.trim()) && <ContactForm />}
        </>
      )}
      </main>
      <a
        href="#main-content"
        className="back-to-top"
        onClick={(e) => {
          e.preventDefault()
          focusMain()
        }}
      >
        {t('app.backToTop')}
      </a>
      {(sectionMatches.footer || !debouncedQuery.trim()) && (
        <footer className="app-footer">
          {t('app.footer')} · {t('app.version', { version: '0.1.0' })}
        </footer>
      )}
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
