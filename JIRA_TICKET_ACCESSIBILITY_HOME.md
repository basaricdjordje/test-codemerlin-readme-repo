# Jira ticket (copy-paste)

## Title
**Accessibility: fix Home page axe E2E failures and minor a11y gaps**

## Description
Playwright + axe E2E for Home is currently failing locally / in CI (see `test-results/a11y-Accessibility-home-*`). This ticket covers addressing all reported axe violations on the default Home view, aligning external links with tooling expectations, giving the primary navigation landmark an accessible name, and tightening keyboard, language, contrast, and structure checks listed below. Outcome: a passing a11y job in CI and WCAG 2.1 AA alignment where the automated rules apply.

**Parent / Epic (optional):** Umbrella AC / Phase 2 follow-up  
**Type:** Bug / Task  
**Priority:** High (unblocks a11y pipeline)

## Acceptance Criteria

1. **axe on Home:** The E2E target that runs axe on Home (e.g. `npm run test:e2e`) passes for that scenario in the Chromium project used in CI; no remaining axe violations on that page snapshot.

2. **External links:** All `<a href="..." target="_blank">` that open external sites (e.g. Vite / React logo links in `App.tsx`) include `rel="noopener noreferrer"` (plus any extra attributes axe reports as required).

3. **Nav landmark:** The primary `<nav>` has an accessible name (e.g. `aria-label` from an i18n key) so assistive tech users can identify the region.

4. **Skip link language:** The “Skip to main content” string in `index.html` is either wired to `react-i18next`, or an agreed technical approach is documented in README if HTML cannot use i18n—without leaving Serbian users on a hardcoded English skip link if product policy requires localized chrome.

5. **Verification:** PR description or a Jira comment cites the test result (passing CI line or equivalent) after the change.

6. **Skip link behavior:** Activating the skip link moves keyboard focus into `#main-content` (e.g. programmatic `focus()` where needed); covered by E2E if a test already exists or added alongside axe.

7. **Document language:** When the UI language is `sr` or `en`, `document.documentElement.lang` matches the active locale on Home (not only the static `lang` in `index.html`).

8. **Contrast (themes):** Text and links in the Home layout meet WCAG 2.1 AA contrast (4.5:1 normal text) in both light and dark theme; fix tokens/CSS where axe or manual check fails.

9. **Focus visibility:** All interactive Home controls (search, nav links, buttons, language selector, theme control) show a visible focus indicator consistent with design; no `outline: none` without an equivalent replacement.

10. **Heading structure:** On Home, heading levels are logical (`h1` for page title, `h2` for major sections such as the contact form); no skipped levels that confuse screen reader outline.

11. **Search region:** The search field keeps an accessible name (`aria-label` or visible label association) and, when the “no results” message appears, it is exposed to assistive tech (e.g. `role="status"` or equivalent) and referenced consistently via `aria-describedby` where applicable.

12. **Images:** Decorative vs informative images on Home use appropriate `alt` (empty `alt=""` only if purely decorative); external logo links expose purpose (link text or `img` alt) per axe link-name rules.
