import { describe, it, expect } from 'vitest'
import { matchesSearch } from './search'

describe('matchesSearch', () => {
  it('returns true when query is empty or whitespace', () => {
    expect(matchesSearch(['Profile', 'Home'], '')).toBe(true)
    expect(matchesSearch(['Profile', 'Home'], '   ')).toBe(true)
  })

  it('returns true when any text contains the query (case-insensitive)', () => {
    expect(matchesSearch(['Profile', 'Home'], 'pro')).toBe(true)
    expect(matchesSearch(['Profile', 'Home'], 'PRO')).toBe(true)
    expect(matchesSearch(['Profile', 'Home'], 'home')).toBe(true)
  })

  it('returns false when no text matches', () => {
    expect(matchesSearch(['Profile', 'Home'], 'xyz')).toBe(false)
    expect(matchesSearch(['Settings', 'Theme'], 'profile')).toBe(false)
  })

  it('supports partial matching', () => {
    expect(matchesSearch(['Contact Form'], 'contact')).toBe(true)
    expect(matchesSearch(['Contact Form'], 'form')).toBe(true)
    expect(matchesSearch(['Welcome to the application'], 'welcome')).toBe(true)
  })
})
