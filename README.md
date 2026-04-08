# test-codemerlin-readme-repo

## TEST FOR TEAM METRICS

React + TypeScript + Vite application with internationalization (i18n) via react-i18next.

## Internationalization

The app uses **react-i18next** with **Serbian (sr)** as the fallback language. When a translation is missing for the selected language, Serbian messages are shown.

**Lazy loading:** English (en) is bundled at startup. Serbian (sr) is loaded on demand when the user switches languages, reducing initial bundle size. Loaded translations are cached for fast subsequent switches.

### Supported Languages

- **English (en)** – primary
- **Serbian (sr)** – fallback

### Adding a New Language

1. **Create a new translation file** in `src/locales/`:
   ```
   src/locales/<language-code>.json
   ```
   Example for German: `src/locales/de.json`

2. **Copy the structure** from `src/locales/en.json` or `src/locales/sr.json` and translate all keys:
   ```json
   {
     "common": {
       "save": "Speichern",
       "cancel": "Abbrechen",
       ...
     },
     "navigation": { ... },
     "app": { ... }
   }
   ```

3. **Register the language in i18n config** – edit `src/i18n.ts`:
   ```ts
   import de from './locales/de.json'

   const resources = {
     en: { translation: en },
     sr: { translation: sr },
     de: { translation: de },  // add new language
   }

   // Add to supportedLngs
   supportedLngs: ['en', 'sr', 'de'],
   ```

4. **Update tests** – add a test case in `src/App.test.tsx` for the new language and ensure `src/translations.test.ts` validates the new locale structure.

5. **Run tests** to verify:
   ```bash
   npm run test
   ```

### Translation Key Structure

- `common.*` – shared actions (save, cancel, delete, edit, loading, error, success, required, search)
- `form.*` – contact form (title, name, email, placeholders, submitSuccess, deleteConfirm)
- `navigation.*` – nav items (home, settings, profile, logout)
- `app.*` – app-level labels (title, language, welcome, countIs with `{{count}}` interpolation, footer)

A **language selector** in the header lets users switch between English and Serbian. The count button and footer use interpolated translations.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs ESLint, Vitest, production build, and Playwright smoke tests on pushes and pull requests to `main` (and on `feature/**` branches).

## Scripts

- `npm run dev` – start development server
- `npm run build` – build for production
- `npm run test` – run unit tests (Vitest)
- `npm run test:e2e` – run end-to-end smoke tests (Playwright; starts dev server automatically)
- `npm run test:e2e:ui` – Playwright UI mode
- `npm run preview` – preview production build

**E2E smoke tests** live in `e2e/`. They use Chromium and require browsers installed once: `npx playwright install chromium`.

### Jira ticket helper

1. Copy `.env.example` to `.env` and set `JIRA_EMAIL` and `JIRA_API_TOKEN`.
2. Run `npm run jira:tickets` to create tickets in project `KAN` (or set `JIRA_PROJECT` in `.env`).
3. `npm run jira:tickets:single` creates only the Playwright E2E ticket (`JIRA_SINGLE=1`).

The file `.env` is gitignored; never commit API tokens.

- `npm run jira:big-ticket` – creates **one** umbrella Jira task with **40+** acceptance criteria (same `.env`).
