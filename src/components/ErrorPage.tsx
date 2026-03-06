import { useTranslation } from 'react-i18next'
import './ErrorPage.css'

interface ErrorPageProps {
  onTryAgain: () => void
  onGoHome: () => void
}

export function ErrorPage({ onTryAgain, onGoHome }: ErrorPageProps) {
  const { t } = useTranslation()

  return (
    <div className="error-page" role="alert" aria-labelledby="error-title">
      <h1 id="error-title" className="error-page__title">
        {t('error.title')}
      </h1>
      <p className="error-page__message">{t('error.message')}</p>
      <div className="error-page__actions">
        <button type="button" onClick={onTryAgain} className="error-page__btn">
          {t('error.tryAgain')}
        </button>
        <button type="button" onClick={onGoHome} className="error-page__btn error-page__btn--secondary">
          {t('error.goHome')}
        </button>
      </div>
    </div>
  )
}
