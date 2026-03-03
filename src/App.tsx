import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ContactForm } from './components/ContactForm'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()
  const [count, setCount] = useState(0)

  return (
    <>
      <main id="main-content" tabIndex={-1}>
      <div className="language-selector">
        <span className="help-hint" title={t('app.accessibilityInfo')} aria-label={t('app.accessibilityInfo')}>
          {t('app.help')} (?)
        </span>
        <label htmlFor="lang">{t('app.language')}:</label>
        <select
          id="lang"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          aria-label={t('app.language')}
        >
          <option value="en">English</option>
          <option value="sr">Srpski</option>
        </select>
      </div>
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
      </main>
      <footer className="app-footer">
        {t('app.footer')} · {t('app.version', { version: '0.1.0' })}
      </footer>
    </>
  )
}

export default App
