import { describe, it, expect } from 'vitest'
import en from './locales/en.json'
import sr from './locales/sr.json'

const translationKeys = ['common.save', 'common.cancel', 'common.delete', 'common.edit', 'common.loading', 'common.error', 'common.success', 'common.required', 'common.search', 'form.title', 'form.name', 'form.email', 'form.namePlaceholder', 'form.emailPlaceholder', 'form.submitSuccess', 'form.deleteConfirm', 'navigation.home', 'navigation.settings', 'navigation.profile', 'navigation.logout', 'app.title', 'app.help', 'app.accessibilityInfo', 'app.language', 'app.welcome', 'app.countIs', 'app.footer', 'app.version', 'app.loadingLanguage', 'app.loadError', 'app.backToTop', 'app.darkMode', 'app.lightMode', 'settings.title', 'settings.theme', 'profile.title', 'profile.displayName', 'profile.displayNamePlaceholder', 'profile.displayNameHint', 'profile.email', 'profile.emailPlaceholder', 'profile.theme', 'profile.language', 'profile.edit', 'profile.changeInSettings', 'search.placeholder', 'search.noResults', 'search.ariaDescription', 'offline.message', 'offline.backOnline', 'error.title', 'error.message', 'error.tryAgain', 'error.goHome']

function getNestedKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getNestedKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

describe('Translation keys', () => {
  it('Serbian translations contain all main UI keys', () => {
    getNestedKeys(sr as Record<string, unknown>)
    for (const key of translationKeys) {
      const parts = key.split('.')
      let obj: Record<string, unknown> = sr as Record<string, unknown>
      for (const part of parts) {
        expect(obj).toHaveProperty(part)
        obj = obj[part] as Record<string, unknown>
      }
    }
  })

  it('English translations contain all main UI keys', () => {
    getNestedKeys(en as Record<string, unknown>)
    for (const key of translationKeys) {
      const parts = key.split('.')
      let obj: Record<string, unknown> = en as Record<string, unknown>
      for (const part of parts) {
        expect(obj).toHaveProperty(part)
        obj = obj[part] as Record<string, unknown>
      }
    }
  })

  it('Serbian and English have same structure', () => {
    const enKeys = getNestedKeys(en as Record<string, unknown>).sort()
    const srKeys = getNestedKeys(sr as Record<string, unknown>).sort()
    expect(srKeys).toEqual(enKeys)
  })
})
