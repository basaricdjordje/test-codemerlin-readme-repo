import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ErrorBoundary } from './ErrorBoundary'

function Thrower(): never {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  it('renders error page when child throws', async () => {
    await i18n.changeLanguage('en')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <Thrower />
        </ErrorBoundary>
      </I18nextProvider>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Go to home/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('shows localized error page in Serbian', async () => {
    await i18n.changeLanguage('sr')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <Thrower />
        </ErrorBoundary>
      </I18nextProvider>
    )

    expect(screen.getByText('Nešto nije u redu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pokušaj ponovo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Na početnu/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
