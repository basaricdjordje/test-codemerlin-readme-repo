# NFR & Code Quality Improvements (CodeMerlin Review Fixes)

**Epic / Parent:** Umbrella AC Implementation
**Type:** Task / Tech Debt
**Priority:** High

## Description
Based on the recent CodeMerlin AI review (Score: 4.6), the application requires several non-functional requirement (NFR) improvements and code quality fixes to meet production standards. This ticket covers responsiveness, cross-browser E2E testing, accessibility automation, performance benchmarking, and fixing identified memory leaks.

## Acceptance Criteria

### 1. Responsive Design Implementation
- [ ] **AC 1.1:** Implement explicit CSS media queries for Mobile (375px), Tablet (768px), and Desktop (1440px) breakpoints in `src/App.css` and `src/components/ContactForm.css`.
- [ ] **AC 1.2:** Ensure no horizontal scrolling occurs at any of the specified breakpoints.

### 2. Cross-Browser E2E Testing
- [ ] **AC 2.1:** Update `playwright.config.ts` to include testing projects for `firefox`, `webkit` (Safari), and `Microsoft Edge` (or standard Chromium if Edge is unavailable in the CI environment).
- [ ] **AC 2.2:** Add mobile viewports (e.g., `Mobile Chrome`, `Mobile Safari`) to the Playwright testing matrix.

### 3. Accessibility (a11y) Automation
- [ ] **AC 3.1:** Integrate automated accessibility testing (e.g., `@axe-core/playwright`) into the E2E test suite.
- [ ] **AC 3.2:** Verify that all interactive elements and text maintain a minimum color contrast ratio of 4.5:1 (WCAG 2.1 Level AA) across both light and dark themes.

### 4. Performance Benchmarking
- [ ] **AC 4.1:** Integrate a performance check (e.g., Lighthouse CI or Playwright performance assertions) into the GitHub Actions pipeline (`.github/workflows/ci.yml`).
- [ ] **AC 4.2:** The application must assert a Largest Contentful Paint (LCP) of under 2.5 seconds and a general performance score of >= 80.

### 5. Visual Feedback & State Management
- [ ] **AC 5.1:** Implement explicit loading states (e.g., spinners or disabled buttons) during asynchronous actions (e.g., language switching, form submission).
- [ ] **AC 5.2:** Replace raw text messages with a proper Toast notification component for success/error feedback (e.g., after logout or form submission).

### 6. Code Quality & Bug Fixes
- [ ] **AC 6.1:** Fix the memory leak in `src/App.tsx` (line 91) by adding a cleanup function (`clearTimeout`) for the logout message timeout.
- [ ] **AC 6.2:** Fix the swallowed error in `src/components/LanguageSelector.tsx` (line 19) by properly logging the localization failure (e.g., `console.error`) instead of ignoring it.
