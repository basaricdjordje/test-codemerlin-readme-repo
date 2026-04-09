import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import './ContactForm.css'

export function ContactForm() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showDeleteConfirm) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowDeleteConfirm(false)
        return
      }
      if (e.key !== 'Tab' || focusable.length === 0) return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showDeleteConfirm])

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
    if (!validate()) {
      showToast(`${t('common.error')}: ${t('common.required')}`, 'error')
      return
    }
    showToast(`${t('common.success')}: ${t('form.submitSuccess')}`, 'success')
  }

  const handleCancel = () => {
    setName('')
    setEmail('')
    setErrors({})
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
            data-testid="contact-delete-open"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('common.delete')}
          </button>
        </div>
      </form>
      {showDeleteConfirm && (
        <div
          className="delete-confirm-overlay"
          role="presentation"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            ref={dialogRef}
            className="delete-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-dialog-title" className="delete-dialog-heading">
              {t('form.deleteDialogTitle')}
            </h2>
            <p id="delete-dialog-desc">{t('form.deleteConfirm')}</p>
            <div className="dialog-actions">
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  handleCancel()
                }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
