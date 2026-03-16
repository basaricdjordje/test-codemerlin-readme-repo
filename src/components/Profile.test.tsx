import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Profile } from './Profile'

const PROFILE_NAME_KEY = 'app-profile-name'
const PROFILE_EMAIL_KEY = 'app-profile-email'

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
    localStorage.removeItem(PROFILE_NAME_KEY)
    localStorage.removeItem(PROFILE_EMAIL_KEY)
  })

  it('renders profile with view mode, theme, and language', async () => {
    renderProfile()
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /theme/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /language/i })).toBeInTheDocument()
  })

  it('shows Edit button and switches to edit form on click', async () => {
    renderProfile()
    const editBtn = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editBtn)
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('persists name and email to localStorage on save', async () => {
    renderProfile()
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.change(screen.getByLabelText(/display name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(localStorage.getItem(PROFILE_NAME_KEY)).toBe('John Doe')
    expect(localStorage.getItem(PROFILE_EMAIL_KEY)).toBe('john@example.com')
  })

  it('restores name and email from localStorage', async () => {
    localStorage.setItem(PROFILE_NAME_KEY, 'Jane')
    localStorage.setItem(PROFILE_EMAIL_KEY, 'jane@test.com')
    renderProfile()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('jane@test.com')).toBeInTheDocument()
  })

  it('shows links to Settings for theme and language', async () => {
    renderProfile()
    const links = screen.getAllByRole('link', { name: /change in settings/i })
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('shows Serbian translations when language is sr', async () => {
    await i18n.changeLanguage('sr')
    renderProfile()
    expect(screen.getByRole('heading', { name: 'Profil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /izmeni/i })).toBeInTheDocument()
  })
})
