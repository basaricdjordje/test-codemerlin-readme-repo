import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import App from '../App'

const THEME_KEY = 'app-theme'

function fireThemeShortcut() {
  fireEvent.keyDown(window, {
    key: 'T',
    shiftKey: true,
    ctrlKey: true,
    metaKey: false,
  })
}

describe('Theme keyboard shortcut (Ctrl+Shift+T / Cmd+Shift+T)', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.removeItem(THEME_KEY)
  })

  it('shortcut toggles theme and updates data-theme attribute', async () => {
    localStorage.setItem(THEME_KEY, 'dark')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireThemeShortcut()
    expect(document.documentElement.dataset.theme).toBe('light')

    fireThemeShortcut()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('pressing shortcut again restores previous theme', async () => {
    localStorage.setItem(THEME_KEY, 'light')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(document.documentElement.dataset.theme).toBe('light')

    fireThemeShortcut()
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireThemeShortcut()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('typing T in name input does not trigger theme switching', async () => {
    localStorage.setItem(THEME_KEY, 'dark')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const nameInput = screen.getByLabelText(/name/i)
    nameInput.focus()

    fireEvent.keyDown(nameInput, { key: 'T', shiftKey: false, ctrlKey: false, metaKey: false })
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
