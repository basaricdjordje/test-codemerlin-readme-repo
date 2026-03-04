import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ContactForm.css'

export function ContactForm() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {}
    if (!name.trim()) {
      newErrors.name = t('common.required')
    }
    if (!email.trim()) {
      newErrors.email = t('common.required')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    if (!validate()) {
      setFeedback('error')
      return
    }
    setFeedback('success')
  }

  const handleCancel = () => {
    setName('')
    setEmail('')
    setErrors({})
    setFeedback(null)
    setShowDeleteConfirm(false)
  }

  return (
    <section className="contact-form-section">
      <h2>{t('form.title')}</h2>
      <form onSubmit={handleSubmit} data-testid="contact-form">
        <div className="form-group">
          <label htmlFor="contact-name">{t('form.name')}</label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('form.namePlaceholder')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="error-message" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">{t('form.email')}</label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('form.emailPlaceholder')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>
        <div className="form-actions">
          <button type="submit">{t('common.save')}</button>
          <button type="button" onClick={handleCancel}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('common.delete')}
          </button>
        </div>
      </form>
      {feedback === 'success' && (
        <div className="feedback success" role="status">
          {t('common.success')}: {t('form.submitSuccess')}
        </div>
      )}
      {feedback === 'error' && (
        <div className="feedback error" role="alert">
          {t('common.error')}: {t('common.required')}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="delete-confirm-dialog" role="dialog" aria-modal="true">
          <p>{t('form.deleteConfirm')}</p>
          <div className="dialog-actions">
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                handleCancel()
              }}
            >
              {t('common.delete')}
            </button>
            <button type="button" onClick={() => setShowDeleteConfirm(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
