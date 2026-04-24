# Jira ticket (copy-paste)

## Title
**Implement real logout: clear profile data, navigate home, accessible feedback**

## Description
The primary navigation shows a **Log out** control (`App.tsx`) but it does not run an end-to-end logout flow. Users expect session-like data (at minimum profile fields persisted in `localStorage`) to be cleared, the app to return to a safe default view, and feedback to be visible and announced to assistive technologies. This ticket implements that behavior and documents which keys are cleared vs intentionally preserved (e.g. theme, language).

**Parent / Epic (optional):** Umbrella AC / UX stability  
**Type:** Story / Task  
**Priority:** Medium

## Acceptance Criteria

1. **Handler wired:** The Log out control in the main nav invokes a single `logout` handler (inline or extracted) that performs all side effects below; no dead button.

2. **Profile storage cleared:** Keys `app-profile-name` and `app-profile-email` are removed from `localStorage` on logout (same identifiers used in `Profile.tsx`).

3. **Navigation:** After logout, the app shows the **Home** view and `window.location.hash` is set to `#home` (or equivalent) so URL, bookmarks, and back/forward stay coherent.

4. **Search UI reset:** Any client-only UI state that represents “session context” is reset in a product-agreed way (minimum: clear the debounced search query so the home layout is not stuck filtered).

5. **Theme & language:** Document in the ticket comment or README one line: logout **does** or **does not** clear theme (`app-theme` / `ThemeContext`) and i18n language (`i18next` cache in `localStorage`); implementation must match that decision consistently.

6. **User feedback:** A short, localized confirmation message is shown after logout (existing pattern or new copy under `app.*` keys in `en` / `sr` and bundled `src/locales`).

7. **Accessibility:** The confirmation is exposed with `role="status"` and `aria-live="polite"` (or a shared Toast with the same semantics) so screen readers announce it once.

8. **Timers / cleanup:** If the message auto-hides via `setTimeout`, the timeout is cleared on unmount (and on rapid repeat logout) so React does not warn about updates on unmounted components.

9. **Tests:** At least one unit or RTL test proves that clicking Log out removes the profile keys and updates the view or hash as expected (mock `localStorage` as in existing profile tests).

10. **Edge case:** If the user is on Settings or Profile when logging out, they still land on Home with cleared profile data and no stale profile text until they enter it again.
