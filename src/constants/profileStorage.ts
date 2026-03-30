/** localStorage keys shared by Profile and session logout */
export const PROFILE_NAME_KEY = 'app-profile-name'
export const PROFILE_EMAIL_KEY = 'app-profile-email'
export const IDLE_TIMEOUT_MINUTES_KEY = 'app-idle-timeout-minutes'

export const DEFAULT_IDLE_TIMEOUT_MINUTES = 15
export const IDLE_WARNING_SECONDS = 60

/** Allowed values for the idle-timeout setting (must match Settings UI) */
export const IDLE_TIMEOUT_OPTIONS = [5, 10, 15, 30, 60] as const

export function readIdleTimeoutMinutes(): number {
  if (typeof window === 'undefined') return DEFAULT_IDLE_TIMEOUT_MINUTES
  const raw = localStorage.getItem(IDLE_TIMEOUT_MINUTES_KEY)
  const n = raw != null ? Number.parseInt(raw, 10) : NaN
  if (!Number.isFinite(n)) return DEFAULT_IDLE_TIMEOUT_MINUTES
  if (IDLE_TIMEOUT_OPTIONS.includes(n as (typeof IDLE_TIMEOUT_OPTIONS)[number])) return n
  return DEFAULT_IDLE_TIMEOUT_MINUTES
}
