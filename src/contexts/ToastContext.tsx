import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import './ToastContext.css'

type ToastVariant = 'success' | 'error' | 'info'

type ToastState = { message: string; variant: ToastVariant } | null

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_HIDE_MS = 4000

function ToastViewport({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const { t } = useTranslation()
  if (!toast) return null
  const role = toast.variant === 'error' ? 'alert' : 'status'
  return (
    <div
      className={`app-toast app-toast--${toast.variant}`}
      role={role}
      aria-live="polite"
      data-testid="app-toast"
    >
      <span className="app-toast-message">{toast.message}</span>
      <button
        type="button"
        className="app-toast-dismiss"
        onClick={onDismiss}
        aria-label={t('common.dismiss')}
      >
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setToast(null)
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setToast({ message, variant })
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      setToast(null)
    }, AUTO_HIDE_MS)
  }, [])

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastViewport toast={toast} onDismiss={hideToast} />
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
