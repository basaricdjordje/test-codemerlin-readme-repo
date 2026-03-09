import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './OfflineIndicator.css'

export function OfflineIndicator() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      className="offline-indicator"
      role="status"
      aria-live="polite"
      aria-label={t('offline.message')}
      data-testid="offline-indicator"
    >
      <span className="offline-indicator__icon" aria-hidden>📡</span>
      <span>{t('offline.message')}</span>
    </div>
  )
}
