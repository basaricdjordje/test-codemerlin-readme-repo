import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIdleSession } from './useIdleSession'

describe('useIdleSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onLogout after idle period plus warning countdown', async () => {
    const onLogout = vi.fn()
    const { result } = renderHook(() =>
      useIdleSession({
        idleTimeoutMs: 1000,
        warningSeconds: 2,
        onLogout,
      })
    )

    expect(result.current.showWarning).toBe(false)

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.showWarning).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })
    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(result.current.showWarning).toBe(false)
  })

  it('extendSession dismisses warning and resets idle timer', async () => {
    const onLogout = vi.fn()
    const { result } = renderHook(() =>
      useIdleSession({
        idleTimeoutMs: 1000,
        warningSeconds: 5,
        onLogout,
      })
    )

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.showWarning).toBe(true)

    await act(async () => {
      result.current.extendSession()
    })
    expect(result.current.showWarning).toBe(false)
    expect(onLogout).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.showWarning).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('does not run timers when enabled is false', async () => {
    const onLogout = vi.fn()
    const { result } = renderHook(() =>
      useIdleSession({
        idleTimeoutMs: 500,
        warningSeconds: 1,
        onLogout,
        enabled: false,
      })
    )

    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })
    expect(onLogout).not.toHaveBeenCalled()
    expect(result.current.showWarning).toBe(false)
  })
})
