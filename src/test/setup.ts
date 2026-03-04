import '@testing-library/jest-dom/vitest'
import sr from '../locales/sr.json'

const originalFetch = globalThis.fetch
globalThis.fetch = ((input: RequestInfo | URL) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (url.includes('/locales/sr/')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(sr)),
    } as Response)
  }
  if (url.includes('/locales/')) {
    return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('') } as Response)
  }
  return originalFetch(input)
}) as typeof fetch
