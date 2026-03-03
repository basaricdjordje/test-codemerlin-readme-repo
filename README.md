# test-codemerlin-readme-repo

## TEST FOR TEAM METRICS

React + TypeScript + Vite application with internationalization (i18n) via react-i18next.

## Internationalization

The app uses **react-i18next** with **Serbian (sr)** as the fallback language. When a translation is missing for the selected language, Serbian messages are shown.

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

- `common.*` – shared actions (save, cancel, delete, edit, loading, error, success)
- `navigation.*` – nav items (home, settings, profile, logout)
- `app.*` – app-level labels (title, language, welcome)

A **language selector** in the header lets users switch between English and Serbian.

## Scripts

- `npm run dev` – start development server
- `npm run build` – build for production
- `npm run test` – run tests
- `npm run preview` – preview production build
