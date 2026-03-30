import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { IDLE_TIMEOUT_OPTIONS } from '../constants/profileStorage'
import { useSession } from '../contexts/SessionContext'
import './Settings.css'

export function Settings() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { idleTimeoutMinutes, setIdleTimeoutMinutes } = useSession()

  return (
    <section className="settings-page" aria-labelledby="settings-heading">
      <h2 id="settings-heading">{t('settings.title')}</h2>
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
      <div className="settings-section settings-section--stack">
        <label htmlFor="idle-timeout-select" className="settings-label">
          {t('settings.idleTimeout')}
        </label>
        <p id="idle-timeout-hint" className="settings-hint">
          {t('settings.idleTimeoutHint')}
        </p>
        <select
          id="idle-timeout-select"
          className="idle-timeout-select"
          value={idleTimeoutMinutes}
          onChange={(e) => setIdleTimeoutMinutes(Number(e.target.value))}
          aria-describedby="idle-timeout-hint"
        >
          {IDLE_TIMEOUT_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {t('settings.idleTimeoutMinutes', { count: m })}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
