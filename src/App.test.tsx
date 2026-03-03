import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
    expect(screen.getByText('Sačuvaj')).toBeInTheDocument()
    expect(screen.getByText('Otkaži')).toBeInTheDocument()
    expect(screen.getByText('Učitavanje...')).toBeInTheDocument()
    expect(screen.getByText('Dobrodošli u aplikaciju')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pretraga')).toBeInTheDocument()
    expect(screen.getByText('© 2025 Aplikacija')).toBeInTheDocument()
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
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Welcome to the application')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByText('© 2025 Application')).toBeInTheDocument()
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
    const select = screen.getByRole('combobox', { name: /language/i })
    expect(select).toHaveValue('en')
    fireEvent.change(select, { target: { value: 'sr' } })
    await screen.findByText(/Jezik/)
    expect(screen.getByText('Aplikacija')).toBeInTheDocument()
  })
})
