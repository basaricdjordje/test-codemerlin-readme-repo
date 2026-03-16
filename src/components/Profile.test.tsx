import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Profile } from './Profile'

const DISPLAY_NAME_KEY = 'app-display-name'

function renderProfile() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Profile />
      </ThemeProvider>
    </I18nextProvider>
  )
}

describe('Profile', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.removeItem(DISPLAY_NAME_KEY)
  })

  it('renders profile with display name input, theme, and language', async () => {
    renderProfile()
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /theme/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /language/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dark mode|light mode/i })).toBeInTheDocument()
  })

  it('persists display name to localStorage', async () => {
    renderProfile()
    const input = screen.getByLabelText(/display name/i)
    fireEvent.change(input, { target: { value: 'John Doe' } })
    expect(localStorage.getItem(DISPLAY_NAME_KEY)).toBe('John Doe')
  })

  it('restores display name from localStorage', async () => {
    localStorage.setItem(DISPLAY_NAME_KEY, 'Jane')
    renderProfile()
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
  })

  it('theme toggle changes theme', async () => {
    localStorage.setItem('app-theme', 'dark')
    renderProfile()
    const toggle = screen.getByRole('button', { name: /dark mode|light mode/i })
    fireEvent.click(toggle)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('shows Serbian translations when language is sr', async () => {
    await i18n.changeLanguage('sr')
    renderProfile()
    expect(screen.getByRole('heading', { name: 'Profil' })).toBeInTheDocument()
    expect(screen.getByLabelText(/prikazano ime/i)).toBeInTheDocument()
  })
})
