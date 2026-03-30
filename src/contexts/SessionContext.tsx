import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  IDLE_TIMEOUT_MINUTES_KEY,
  IDLE_WARNING_SECONDS,
  PROFILE_EMAIL_KEY,
  PROFILE_NAME_KEY,
  readIdleTimeoutMinutes,
} from '../constants/profileStorage'
import { useIdleSession } from '../hooks/useIdleSession'
import { IdleLogoutModal } from '../components/IdleLogoutModal'

type SessionContextValue = {
  logout: () => void
  profileVersion: number
  idleTimeoutMinutes: number
  setIdleTimeoutMinutes: (minutes: number) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profileVersion, setProfileVersion] = useState(0)
  const [idleTimeoutMinutes, setIdleTimeoutMinutesState] = useState(() =>
    readIdleTimeoutMinutes()
  )

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PROFILE_NAME_KEY)
      localStorage.removeItem(PROFILE_EMAIL_KEY)
    }
    setProfileVersion((v) => v + 1)
  }, [])

  const setIdleTimeoutMinutes = useCallback((minutes: number) => {
    const clamped = Math.min(120, Math.max(1, Math.round(minutes)))
    setIdleTimeoutMinutesState(clamped)
    if (typeof window !== 'undefined') {
      localStorage.setItem(IDLE_TIMEOUT_MINUTES_KEY, String(clamped))
    }
  }, [])

  const idleTimeoutMs = idleTimeoutMinutes * 60 * 1000

  const { showWarning, secondsLeft, extendSession } = useIdleSession({
    idleTimeoutMs,
    warningSeconds: IDLE_WARNING_SECONDS,
    onLogout: logout,
    enabled: true,
  })

  const value = useMemo(
    () => ({
      logout,
      profileVersion,
      idleTimeoutMinutes,
      setIdleTimeoutMinutes,
    }),
    [logout, profileVersion, idleTimeoutMinutes, setIdleTimeoutMinutes]
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
      <IdleLogoutModal
        open={showWarning}
        secondsLeft={secondsLeft}
        onStayLoggedIn={extendSession}
      />
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
