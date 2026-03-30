import { useTranslation } from 'react-i18next'
import './IdleLogoutModal.css'

type Props = {
  open: boolean
  secondsLeft: number
  onStayLoggedIn: () => void
}

export function IdleLogoutModal({ open, secondsLeft, onStayLoggedIn }: Props) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div
      className="idle-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="idle-modal-title"
      aria-describedby="idle-modal-desc"
    >
      <div className="idle-modal">
        <h2 id="idle-modal-title" className="idle-modal-title">
          {t('session.idleTitle')}
        </h2>
        <p id="idle-modal-desc" className="idle-modal-desc">
          {t('session.idleMessage', { seconds: secondsLeft })}
        </p>
        <div className="idle-modal-actions">
          <button type="button" className="idle-modal-primary" onClick={onStayLoggedIn}>
            {t('session.stayLoggedIn')}
          </button>
        </div>
      </div>
    </div>
  )
}
