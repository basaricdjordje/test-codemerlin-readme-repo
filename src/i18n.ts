import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

import en from './locales/en.json'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 500

async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES
): Promise<{ status: number; data: string }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      const data = await res.text()
      return { status: res.status, data }
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
    }
  }
  throw new Error('Failed to load translations')
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    partialBundledLanguages: true,
    fallbackLng: ['sr', 'en'],
    supportedLngs: ['en', 'sr'],
    load: 'languageOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      request: (
        _options: Record<string, unknown>,
        url: string,
        _payload: Record<string, unknown>,
        callback: (err: Error | null, res?: { status: number; data: string }) => void
      ) => {
        fetchWithRetry(url)
          .then((res) => callback(null, res))
          .catch((err) => callback(err as Error))
      },
    },
  })

export default i18n
