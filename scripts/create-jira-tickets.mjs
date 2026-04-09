#!/usr/bin/env node
import { config } from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env') })

/**
 * Create Jira tickets via REST API.
 * Loads `.env` from repo root (see `.env.example`). Never commit real tokens.
 */

const DOMAIN = process.env.JIRA_DOMAIN || 'qcerris.atlassian.net'
const PROJECT = process.env.JIRA_PROJECT || 'KAN'
const EMAIL = process.env.JIRA_EMAIL
const API_TOKEN = process.env.JIRA_API_TOKEN

const JIRA_URL = `https://${DOMAIN}/rest/api/3/issue`

const ALL_TICKETS = [
  {
    summary: 'Keyboard Shortcuts',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, accessibility, ux

h2. Summary
Add global keyboard shortcuts for common actions (focus search, quick nav, escape to close modals).

h2. Description
The app has no keyboard shortcuts. Implement shortcuts such as Ctrl/Cmd+K to focus search, 1–3 for Home/Settings/Profile, Escape to close modals.

h2. Acceptance Criteria
* Ctrl/Cmd+K focuses search input
* Escape closes modal dialogs
* Shortcuts are documented (Help or tooltip)
* All shortcut text is localized (EN + SR)`,
    labels: ['enhancement', 'accessibility', 'ux'],
  },
  {
    summary: 'Print-Friendly Styles',
    description: `*Type:* Feature
*Priority:* Low
*Component:* Frontend
*Labels:* enhancement, ux

h2. Summary
Add print-optimized CSS so the app can be printed without broken layout.

h2. Description
Add @media print styles to hide nav, simplify layout, ensure main content prints legibly.

h2. Acceptance Criteria
* Printed output renders correctly
* Nav, search, footer hidden or simplified
* Main content prints legibly`,
    labels: ['enhancement', 'ux'],
  },
  {
    summary: 'Export User Data',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, privacy, ux

h2. Summary
Allow users to export their profile and preferences as a JSON file.

h2. Description
Add an "Export my data" action on Profile or Settings that downloads profile name, email, theme, and language as JSON.

h2. Acceptance Criteria
* Export button on Profile or Settings
* Downloaded file contains valid JSON
* Data includes profile, theme, language
* Text localized (EN + SR)
* Unit tests cover export logic`,
    labels: ['enhancement', 'privacy', 'ux'],
  },
  {
    summary: 'Contact Form Draft Persistence',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, ux

h2. Summary
Save Contact form draft to localStorage so input survives refresh and navigation.

h2. Description
Save name and email to localStorage as user types; restore on mount. Provide "Clear draft" option.

h2. Acceptance Criteria
* Draft saved to localStorage
* Draft restored on page load
* Option to clear draft
* Clear-draft text localized (EN + SR)
* Unit tests cover draft persistence`,
    labels: ['enhancement', 'ux'],
  },
  {
    summary: 'Remember Last Visited View',
    description: `*Type:* Feature
*Priority:* Low
*Component:* Frontend
*Labels:* enhancement, ux

h2. Summary
Restore last viewed page (#home, #settings, or #profile) on reload.

h2. Description
Store current hash in localStorage when navigating; on load, redirect to last hash if valid.

h2. Acceptance Criteria
* Last view restored after refresh
* Uses existing hash-based routing
* Unit tests cover restore logic`,
    labels: ['enhancement', 'ux'],
  },
  {
    summary: 'Add German (de) Language',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, i18n

h2. Summary
Add German as a third language with full translation coverage.

h2. Description
Create de.json, register in i18n config, add to LanguageSelector. Ensure lazy loading like Serbian.

h2. Acceptance Criteria
* German option in LanguageSelector
* All translation keys present in de.json
* Lazy loading for German
* Structure matches EN and SR
* translations.test.ts validates German keys`,
    labels: ['enhancement', 'i18n'],
  },
  {
    summary: 'Focus Trap in Modal Dialogs',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, accessibility

h2. Summary
Implement focus trap in modal dialogs so keyboard users cannot tab outside the modal.

h2. Description
For modals (e.g. delete confirmation), trap focus inside, return focus on close, support Escape to close.

h2. Acceptance Criteria
* Focus trapped within modal
* Tab cycles only inside modal
* Escape closes modal and returns focus
* Focus restored to trigger element
* Unit tests cover focus behavior`,
    labels: ['enhancement', 'accessibility'],
  },
  {
    summary: 'Loading Skeleton Placeholders',
    description: `*Type:* Feature
*Priority:* Low
*Component:* Frontend
*Labels:* enhancement, ux

h2. Summary
Show skeleton placeholders while async content loads.

h2. Description
Replace generic "Loading..." with skeleton layouts for Profile, Contact form, or other async sections.

h2. Acceptance Criteria
* Skeleton UI for at least one section
* Skeleton layout matches content structure
* Smooth transition when content loads`,
    labels: ['enhancement', 'ux'],
  },
  {
    summary: 'Breadcrumb Navigation',
    description: `*Type:* Feature
*Priority:* Low
*Component:* Frontend
*Labels:* enhancement, ux, accessibility

h2. Summary
Add breadcrumb navigation showing current location (e.g. Home > Profile).

h2. Description
Render breadcrumb component based on current hash with links for each level.

h2. Acceptance Criteria
* Breadcrumbs visible on Settings and Profile
* Clicking navigates correctly
* Semantic nav with aria-label
* Text localized (EN + SR)`,
    labels: ['enhancement', 'ux', 'accessibility'],
  },
  {
    summary: 'Session Timeout / Idle Logout',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, security, ux

h2. Summary
Automatically log out users after a configurable period of inactivity.

h2. Description
Track user activity (clicks, keypresses). On idle for N minutes, show warning modal before auto-logout. Clear profile data on timeout.

h2. Acceptance Criteria
* Idle timeout configurable (e.g. 15 min)
* Warning modal before logout ("Log out in 60 seconds")
* Option to extend session / cancel logout
* Profile data cleared on auto-logout
* Text localized (EN + SR)
* Unit tests cover timeout behavior`,
    labels: ['enhancement', 'security', 'ux'],
  },
  {
    summary: 'Respect prefers-reduced-motion',
    description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, accessibility, ux

h2. Summary
Honor the user's system preference for reduced motion (prefers-reduced-motion: reduce).

h2. Description
Detect prefers-reduced-motion via matchMedia. When enabled, disable or shorten CSS transitions and animations. Listen for preference changes at runtime.

h2. Acceptance Criteria
* matchMedia drives a React hook or CSS variables
* Transitions/animations disabled or minimal when reduce is on
* Preference changes apply without full page reload
* Unit or integration test where feasible (mock matchMedia)`,
    labels: ['enhancement', 'accessibility', 'ux'],
  },
]

/** Run with JIRA_SINGLE=1 to create only this ticket (one-off). */
const ONE_OFF_TICKET = {
  summary: 'E2E smoke tests with Playwright',
  description: `*Type:* Feature
*Priority:* Medium
*Component:* Frontend
*Labels:* enhancement, testing, ci

h2. Summary
Add Playwright end-to-end tests for critical user flows.

h2. Description
Install Playwright and add smoke tests covering: load home, switch language, open Settings and Profile via hash, logout clears data. Optionally run in CI on pull requests.

h2. Acceptance Criteria
* Playwright configured in the repo
* At least one smoke test passes locally (npm run test:e2e or similar)
* Tests use stable selectors (roles, labels)
* README documents how to run E2E tests
* Optional: CI job runs E2E on PR`,
  labels: ['enhancement', 'testing', 'ci'],
}

/** JIRA_SINGLE=1 → only ONE_OFF_TICKET. JIRA_ONLY_LAST=1 → last item in ALL_TICKETS. */
const tickets =
  process.env.JIRA_SINGLE === '1'
    ? [ONE_OFF_TICKET]
    : process.env.JIRA_ONLY_LAST === '1'
      ? [ALL_TICKETS[ALL_TICKETS.length - 1]]
      : ALL_TICKETS

async function createIssue(ticket) {
  const body = {
    fields: {
      project: { key: PROJECT },
      issuetype: { name: 'Task' },
      summary: ticket.summary,
      labels: ticket.labels,
    },
  }
  if (ticket.description) {
    const lines = ticket.description.split('\n').filter(Boolean)
    const content = lines.map((line) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    }))
    body.fields.description = { type: 'doc', version: 1, content }
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
    const err = await res.text()
    throw new Error(`Jira API error ${res.status}: ${err}`)
  }
  return res.json()
}

async function main() {
  if (!EMAIL || !API_TOKEN) {
    console.error('Usage: JIRA_EMAIL=you@company.com JIRA_API_TOKEN=xxx node scripts/create-jira-tickets.mjs')
    console.error('Optional: JIRA_DOMAIN=qcerris.atlassian.net JIRA_PROJECT=KAN')
    console.error('Optional: JIRA_ONLY_LAST=1  |  JIRA_SINGLE=1')
    process.exit(1)
  }
  console.log(`Creating ${tickets.length} tickets in ${PROJECT}...`)
  for (let i = 0; i < tickets.length; i++) {
    const t = tickets[i]
    try {
      const created = await createIssue(t)
      console.log(`  ${i + 1}. ${t.summary} -> ${created.key}`)
    } catch (e) {
      console.error(`  ${i + 1}. ${t.summary} -> FAILED: ${e.message}`)
    }
  }
}

main()
