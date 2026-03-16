import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import App from './App'

describe('App translations', () => {
  it('renders Serbian fallback when language is sr', async () => {
    await i18n.changeLanguage('sr')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByText(/Jezik/)).toBeInTheDocument()
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
    expect(screen.getByText('Početna')).toBeInTheDocument()
    expect(screen.getByText('Podešavanja')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Odjava')).toBeInTheDocument()
    expect(screen.getAllByText('Sačuvaj').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Otkaži').length).toBeGreaterThan(0)
    expect(screen.getByText('Učitavanje...')).toBeInTheDocument()
    expect(screen.getByText('Dobrodošli u aplikaciju')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pretraga')).toBeInTheDocument()
    expect(screen.getByText(/© 2025 Aplikacija/)).toBeInTheDocument()
    expect(screen.getByText('Kontakt formular')).toBeInTheDocument()
  })

  it('renders English when language is en', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByText(/Language/)).toBeInTheDocument()
    expect(screen.getByText('Application')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Log out')).toBeInTheDocument()
    expect(screen.getAllByText('Save').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cancel').length).toBeGreaterThan(0)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Welcome to the application')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByText(/© 2025 Application/)).toBeInTheDocument()
    expect(screen.getByText('Contact Form')).toBeInTheDocument()
  })

  it('falls back to Serbian when translation key is missing in current language', async () => {
    await i18n.changeLanguage('xx')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
  })

  it('language selector switches between en and sr', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const select = screen.getAllByRole('combobox', { name: /language/i })[0]
    expect(select).toHaveValue('en')
    fireEvent.change(select, { target: { value: 'sr' } })
    await screen.findByText(/Jezik/)
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
  })

  it('LanguageSelector switches to sr with lazy-loaded translations', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const select = screen.getAllByRole('combobox', { name: /language/i })[0]
    fireEvent.change(select, { target: { value: 'sr' } })
    await screen.findByText(/Jezik/)
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
  })

  it('subsequent switch to sr is fast (cached)', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const select = screen.getAllByRole('combobox', { name: /language/i })[0]
    fireEvent.change(select, { target: { value: 'sr' } })
    await screen.findByText('Aplikacija')
    fireEvent.change(select, { target: { value: 'en' } })
    await screen.findByText('Application')
    fireEvent.change(select, { target: { value: 'sr' } })
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
  })

  it('navigates to Profile when hash is #profile', async () => {
    await i18n.changeLanguage('en')
    window.location.hash = '#profile'
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    window.location.hash = ''
  })

  it('ContactForm shows validation error for empty required fields', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const form = screen.getByTestId('contact-form')
    const saveButton = within(form).getByRole('button', { name: 'Save' })
    fireEvent.click(saveButton)
    expect(screen.getAllByText('This field is required').length).toBeGreaterThan(0)
  })
})

describe('Search filtering', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('filters content by search query (debounced)', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const searchInput = screen.getByRole('searchbox', { name: /search/i })
    fireEvent.change(searchInput, { target: { value: 'pro' } })
    expect(screen.getByText('Profile')).toBeInTheDocument()
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('shows "No results found" when no content matches', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const searchInput = screen.getByRole('searchbox', { name: /search/i })
    fireEvent.change(searchInput, { target: { value: 'xyz123nomatch' } })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('search is case-insensitive', async () => {
    await i18n.changeLanguage('en')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const searchInput = screen.getByRole('searchbox', { name: /search/i })
    fireEvent.change(searchInput, { target: { value: 'PROFILE' } })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })
})
