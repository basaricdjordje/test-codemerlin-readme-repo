import { useCallback, useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
]

export type UseIdleSessionOptions = {
  idleTimeoutMs: number
  warningSeconds: number
  onLogout: () => void
  enabled?: boolean
}

/**
 * After idleTimeoutMs without activity, shows a warning phase of warningSeconds,
 * then calls onLogout. Any activity during warning dismisses the warning and resets idle.
 */
export function useIdleSession({
  idleTimeoutMs,
  warningSeconds,
  onLogout,
  enabled = true,
}: UseIdleSessionOptions) {
  const lastActivityRef = useRef(Date.now())
  const logoutAtRef = useRef<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(warningSeconds)
  const onLogoutRef = useRef(onLogout)
  onLogoutRef.current = onLogout

  const clearWarning = useCallback(() => {
    logoutAtRef.current = null
    setShowWarning(false)
    setSecondsLeft(warningSeconds)
  }, [warningSeconds])

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    clearWarning()
  }, [clearWarning])

  const extendSession = useCallback(() => {
    resetActivity()
  }, [resetActivity])

  useEffect(() => {
    lastActivityRef.current = Date.now()
    logoutAtRef.current = null
    setShowWarning(false)
    setSecondsLeft(warningSeconds)
  }, [idleTimeoutMs, warningSeconds])

  useEffect(() => {
    if (!enabled) return

    const bump = () => {
      lastActivityRef.current = Date.now()
      if (logoutAtRef.current != null) {
        clearWarning()
      }
    }

    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, bump, { passive: true })
    }
    return () => {
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, bump)
      }
    }
  }, [enabled, clearWarning])

  useEffect(() => {
    if (!enabled) return

    const tick = () => {
      const now = Date.now()

      if (logoutAtRef.current != null) {
        const left = Math.max(0, Math.ceil((logoutAtRef.current - now) / 1000))
        setSecondsLeft(left)
        if (now >= logoutAtRef.current) {
          onLogoutRef.current()
          lastActivityRef.current = Date.now()
          clearWarning()
        }
        return
      }

      const idle = now - lastActivityRef.current
      if (idle >= idleTimeoutMs) {
        logoutAtRef.current = now + warningSeconds * 1000
        setShowWarning(true)
        setSecondsLeft(warningSeconds)
      }
    }

    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [enabled, idleTimeoutMs, warningSeconds, clearWarning])

  return { showWarning, secondsLeft, extendSession, resetActivity }
}
