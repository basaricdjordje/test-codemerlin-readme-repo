import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import './LanguageSelector.css'

export function LanguageSelector() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const handleChange = async (lng: string) => {
    if (lng === i18n.language) return
    setIsLoading(true)
    setLoadError(null)
    const previousLng = i18n.language
    try {
      await i18n.changeLanguage(lng)
    } catch {
      setLoadError(t('app.loadError'))
      await i18n.changeLanguage(previousLng)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="language-selector">
      {isLoading && (
        <span className="language-loading" role="status" aria-live="polite">
          {t('app.loadingLanguage')}
        </span>
      )}
      {loadError && (
        <div className="language-error" role="alert">
          {loadError}
        </div>
      )}
      <span className="help-hint" title={t('app.accessibilityInfo')} aria-label={t('app.accessibilityInfo')}>
        {t('app.help')} (?)
      </span>
      <label htmlFor="lang">{t('app.language')}:</label>
      <select
        id="lang"
        value={i18n.language}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={t('app.language')}
        disabled={isLoading}
      >
        <option value="en">English</option>
        <option value="sr">Srpski</option>
      </select>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
        title={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
      >
        {theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
      </button>
    </div>
  )
}
