# Jira ticket (copy-paste)

## Title
**Phase 2: UX feedback, code stability, and NFR verification**

## Description
After the NFR branch (responsive layout, multi-browser Playwright, axe, Lighthouse CI), this ticket covers user-visible feedback, cleaning up React side effects, better error logging, and additional E2E checks. The goal is to close remaining CodeMerlin / umbrella gaps and reduce production risk.

## Acceptance Criteria

1. **Logout timeout cleanup:** In `App.tsx`, the `setTimeout` that hides the post-logout message must be cleared on unmount (`clearTimeout` in a `useEffect` cleanup or a `useRef` holding the timer id) to avoid updating state on an unmounted component.

2. **Language load errors:** In `LanguageSelector.tsx`, the `catch` block around `changeLanguage` must log the error explicitly (e.g. `console.error`), while keeping the existing fallback to the previous language.

3. **Loading state for async actions:** While `i18n.changeLanguage` is in progress, language controls must stay disabled or show a clear loading indicator; apply consistently across that flow.

4. **Toast notifications:** Success / error messages (e.g. logout, contact form submit) must use a shared Toast component (`role="status"` or `alert`, visibility, auto-dismiss or manual dismiss) instead of plain `<p>` text where applicable.

5. **E2E: skip link:** Playwright test that the skip link targets `#main-content` and focus moves into the main region after keyboard activation.

6. **E2E: delete dialog:** Playwright test that opens the contact form delete dialog, checks `aria-modal`, closes on Escape, and verifies Tab focus stays within the dialog (basic focus trap check).

7. **Dynamic `lang` on `<html>`:** When the app language changes, update `document.documentElement.lang` to `en` or `sr` in line with i18n.

8. **Lighthouse CI stability:** Ensure `lighthouserc.cjs` and the CI job pass reliably on `main` / typical PRs; adjust thresholds or run count if needed to reduce flakiness on GitHub runners.

9. **README:** Short section documenting the NFR pipeline (Playwright projects, axe tests, Lighthouse job) and how to run `npm run test:e2e` and Lighthouse locally.

10. **Dark theme contrast:** Verify (manually or automated) that key text and links under `data-theme="dark"` meet WCAG 2.1 AA contrast (4.5:1 for normal text); fix colors where axe or review finds failures.
