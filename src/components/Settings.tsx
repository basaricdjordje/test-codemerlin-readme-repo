import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import './Settings.css'

export function Settings() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <section className="settings-page" aria-labelledby="settings-heading">
      <h1 id="settings-heading">{t('settings.title')}</h1>
      <div className="settings-section">
        <h3 id="theme-label">{t('settings.theme')}</h3>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
        >
          {theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
        </button>
      </div>
    </section>
  )
}
