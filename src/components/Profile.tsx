import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import './Profile.css'

const DISPLAY_NAME_KEY = 'app-display-name'

function getStoredDisplayName(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(DISPLAY_NAME_KEY) ?? ''
}

export function Profile() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    setDisplayName(getStoredDisplayName())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(DISPLAY_NAME_KEY, displayName)
  }, [displayName])

  const currentLanguage = i18n.language === 'sr' ? 'Srpski' : 'English'

  return (
    <section className="profile-page" aria-labelledby="profile-heading">
      <h2 id="profile-heading">{t('profile.title')}</h2>

      <div className="profile-section">
        <label htmlFor="profile-display-name">{t('profile.displayName')}</label>
        <input
          id="profile-display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t('profile.displayNamePlaceholder')}
          aria-describedby="profile-display-name-hint"
        />
        <span id="profile-display-name-hint" className="profile-hint">
          {t('profile.displayNameHint')}
        </span>
      </div>

      <div className="profile-section">
        <h3 id="profile-theme-label">{t('profile.theme')}</h3>
        <div className="profile-section-content">
          <span className="profile-value">{theme === 'dark' ? t('app.darkMode') : t('app.lightMode')}</span>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h3 id="profile-language-label">{t('profile.language')}</h3>
        <p className="profile-value">{currentLanguage}</p>
        <a href="#settings" className="profile-link">
          {t('profile.changeLanguage')}
        </a>
      </div>
    </section>
  )
}
