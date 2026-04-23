import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './ContactForm.css'

export function ContactForm() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const deleteTriggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelInDialogRef = useRef<HTMLButtonElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const closeDeleteDialog = useCallback((returnFocusTo: 'delete' | 'name') => {
    setShowDeleteConfirm(false)
    queueMicrotask(() => {
      if (returnFocusTo === 'delete') {
        deleteTriggerRef.current?.focus()
      } else {
        nameInputRef.current?.focus()
      }
    })
  }, [])

  useLayoutEffect(() => {
    if (!showDeleteConfirm) return
    cancelInDialogRef.current?.focus()
  }, [showDeleteConfirm])

  useEffect(() => {
    if (!showDeleteConfirm) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusables = () =>
      [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled])')].filter(
        (el) => dialog.contains(el)
      )

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDeleteDialog('delete')
        return
      }
      if (e.key !== 'Tab') return
      const els = focusables()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      const active = document.activeElement
      if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showDeleteConfirm, closeDeleteDialog])

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

  const handleConfirmDeleteInDialog = () => {
    handleCancel()
    queueMicrotask(() => {
      nameInputRef.current?.focus()
    })
  }

  return (
    <section className="contact-form-section">
      <div className="contact-form-section__main" inert={showDeleteConfirm}>
        <h2>{t('form.title')}</h2>
        <form onSubmit={handleSubmit} data-testid="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">{t('form.name')}</label>
            <input
              ref={nameInputRef}
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
              ref={deleteTriggerRef}
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
      </div>
      {showDeleteConfirm && (
        <div
          ref={dialogRef}
          className="delete-confirm-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-label"
        >
          <p id="delete-dialog-label">{t('form.deleteConfirm')}</p>
          <div className="dialog-actions">
            <button ref={cancelInDialogRef} type="button" onClick={() => closeDeleteDialog('delete')}>
              {t('common.cancel')}
            </button>
            <button type="button" className="delete-btn" onClick={handleConfirmDeleteInDialog}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
