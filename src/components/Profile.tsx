import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import './Profile.css'

const PROFILE_NAME_KEY = 'app-profile-name'
const PROFILE_EMAIL_KEY = 'app-profile-email'

function getStored(nameKey: string, emailKey: string): { name: string; email: string } {
  if (typeof window === 'undefined') return { name: '', email: '' }
  return {
    name: localStorage.getItem(nameKey) ?? '',
    email: localStorage.getItem(emailKey) ?? '',
  }
}

export function Profile() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(() => getStored(PROFILE_NAME_KEY, PROFILE_EMAIL_KEY).name)
  const [email, setEmail] = useState(() => getStored(PROFILE_NAME_KEY, PROFILE_EMAIL_KEY).email)
  const [editName, setEditName] = useState(() => getStored(PROFILE_NAME_KEY, PROFILE_EMAIL_KEY).name)
  const [editEmail, setEditEmail] = useState(() => getStored(PROFILE_NAME_KEY, PROFILE_EMAIL_KEY).email)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setName(editName)
    setEmail(editEmail)
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_NAME_KEY, editName)
      localStorage.setItem(PROFILE_EMAIL_KEY, editEmail)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(name)
    setEditEmail(email)
    setIsEditing(false)
  }

  const currentLanguage = i18n.language === 'sr' ? 'Srpski' : 'English'

  return (
    <section className="profile-page" aria-labelledby="profile-heading">
      <h1 id="profile-heading">{t('profile.title')}</h1>

      {isEditing ? (
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-section">
            <label htmlFor="profile-name">{t('profile.displayName')}</label>
            <input
              id="profile-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={t('profile.displayNamePlaceholder')}
              aria-describedby="profile-name-hint"
            />
            <span id="profile-name-hint" className="profile-hint">
              {t('profile.displayNameHint')}
            </span>
          </div>
          <div className="profile-section">
            <label htmlFor="profile-email">{t('profile.email')}</label>
            <input
              id="profile-email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder={t('profile.emailPlaceholder')}
            />
          </div>
          <div className="profile-actions">
            <button type="submit">{t('common.save')}</button>
            <button type="button" onClick={handleCancel}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-section profile-view">
          <div className="profile-row">
            <strong>{t('profile.displayName')}:</strong>
            <span>{name || '—'}</span>
          </div>
          <div className="profile-row">
            <strong>{t('profile.email')}:</strong>
            <span>{email || '—'}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="profile-edit-btn"
            aria-label={t('profile.edit')}
          >
            {t('profile.edit')}
          </button>
        </div>
      )}

      <div className="profile-section">
        <h3 id="profile-theme-label">{t('profile.theme')}</h3>
        <div className="profile-section-content">
          <span className="profile-value">
            {theme === 'dark' ? t('app.darkMode') : t('app.lightMode')}
          </span>
          <a href="#settings" className="profile-link">
            {t('profile.changeInSettings')}
          </a>
        </div>
      </div>

      <div className="profile-section">
        <h3 id="profile-language-label">{t('profile.language')}</h3>
        <div className="profile-section-content">
          <span className="profile-value">{currentLanguage}</span>
          <a href="#settings" className="profile-link">
            {t('profile.changeInSettings')}
          </a>
        </div>
      </div>
    </section>
  )
}
