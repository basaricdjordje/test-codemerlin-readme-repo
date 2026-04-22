#!/usr/bin/env node
/**
 * Creates a single Jira issue with many acceptance criteria (uses repo root `.env`).
 */
import { config } from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env') })

const DOMAIN = process.env.JIRA_DOMAIN || 'qcerris.atlassian.net'
const PROJECT = process.env.JIRA_PROJECT || 'KAN'
const EMAIL = process.env.JIRA_EMAIL
const API_TOKEN = process.env.JIRA_API_TOKEN
const JIRA_URL = `https://${DOMAIN}/rest/api/3/issue`

const SUMMARY = 'Platform & UX: comprehensive acceptance checklist (umbrella)'

const DESCRIPTION_LINES = [
  '*Type:* Feature',
  '*Priority:* Medium',
  '*Component:* Frontend',
  '*Labels:* enhancement, quality, umbrella',
  '',
  'h2. Summary',
  'Single umbrella ticket bundling a large set of acceptance criteria for incremental delivery. Split into sub-tasks or link PRs per section as work progresses.',
  '',
  'h2. Description',
  'This ticket defines cross-cutting expectations for the React + i18n app: accessibility, performance, security of client data, testing, and documentation.',
  '',
  'h2. Acceptance criteria (must all be verifiable)',
  '[ ] All user-visible strings use react-i18next; no hardcoded English in components.',
  '[ ] Serbian (sr) and English (en) have matching translation key sets; tests fail on drift.',
  '[ ] Lazy-loaded locale files load without console errors when switching language.',
  '[ ] Hash routing (#home, #settings, #profile) updates view and survives manual browser back/forward where applicable.',
  '[ ] Settings page shows theme controls; theme persists in localStorage and applies on reload.',
  '[ ] Profile: display name and email editable with Save/Cancel; persisted in localStorage.',
  '[ ] Log out clears profile keys and navigates to #home; confirmation message is announced (aria-live).',
  '[ ] Contact form validates required fields; errors are associated with inputs (aria-describedby).',
  '[ ] Search filters visible sections without breaking layout; empty state message is localized.',
  '[ ] Offline indicator reflects navigator.onLine and shows localized messages.',
  '[ ] Skip link targets #main-content; focus moves to main on activation.',
  '[ ] Interactive controls have visible focus styles; keyboard can reach all nav and form controls.',
  '[ ] Theme toggle has correct aria-pressed / labels for current mode.',
  '[ ] Language select has accessible name; disabled state during async language load.',
  '[ ] Error boundary shows localized error UI and recovery actions.',
  '[ ] No uncaught promise rejections on happy-path navigation (verify in devtools).',
  '[ ] Production build completes without TypeScript errors (npm run build).',
  '[ ] Unit tests pass (npm run test).',
  '[ ] E2E smoke tests pass (npm run test:e2e) with dev server managed by Playwright.',
  '[ ] README documents dev, build, test, E2E, and i18n add-language flow.',
  '[ ] package.json scripts are documented and consistent with CI expectations.',
  '[ ] No secrets (API tokens, passwords) committed; .env is gitignored.',
  '[ ] PWA manifest and service worker do not break offline locale caching for /locales/*.json.',
  '[ ] Footer version or build metadata is accurate or clearly marked as demo.',
  '[ ] Images and logos have appropriate alt text.',
  '[ ] External links (e.g. Vite, React) use rel where needed and open in new tab as designed.',
  '[ ] Mobile viewport: main content remains usable at 320px width (smoke check).',
  '[ ] prefers-color-scheme: document has data-theme or equivalent; no flash of wrong theme on load when preference saved.',
  '[ ] localStorage keys are namespaced consistently (e.g. app- prefix).',
  '[ ] Logout does not clear unrelated keys (theme/language) unless product explicitly requires it.',
  '[ ] Count button and demo card actions do not corrupt state when switching views.',
  '[ ] No console.error in production build when running preview (spot check).',
  '[ ] ESLint passes (npm run lint) with project config.',
  '[ ] Dependencies are pinned reasonably; no accidental major upgrades without review.',
  '[ ] GitHub (or CI) can run test + e2e in documented order if/when pipeline exists.',
  '[ ] Accessibility: heading hierarchy is logical on Home, Settings, Profile.',
  '[ ] Form submit success and error feedback use role=status / role=alert as appropriate.',
  '[ ] Delete confirmation dialog (if present) is keyboard-dismissible and focus-managed.',
  '[ ] Internationalization fallback: missing key falls back per i18n config without blank UI.',
  '[ ] Performance: initial JS bundle size is acceptable for demo; no unnecessary large deps.',
  '[ ] Security: no eval, no dangerouslySetInnerHTML with untrusted input.',
  '[ ] Browser storage quota failures are handled gracefully if tested (optional stretch).',
  '[ ] Documentation links in README point to correct paths after refactors.',
  '[ ] This umbrella ticket is updated or closed when all linked work is tracked elsewhere.',
]

async function main() {
  if (!EMAIL || !API_TOKEN) {
    console.error('Set JIRA_EMAIL and JIRA_API_TOKEN in .env')
    process.exit(1)
  }

  const content = DESCRIPTION_LINES.filter((l) => l !== '').map((line) => ({
    type: 'paragraph',
    content: [{ type: 'text', text: line }],
  }))

  const body = {
    fields: {
      project: { key: PROJECT },
      issuetype: { name: 'Task' },
      summary: SUMMARY,
      labels: ['enhancement', 'quality', 'umbrella'],
      description: { type: 'doc', version: 1, content },
    },
  }

  const res = await fetch(JIRA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${EMAIL}:${API_TOKEN}`).toString('base64')}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error(await res.text())
    process.exit(1)
  }

  const json = await res.json()
  console.log('Created:', json.key, json.self)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
