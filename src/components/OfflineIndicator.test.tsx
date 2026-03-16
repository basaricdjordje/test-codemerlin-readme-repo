import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { OfflineIndicator } from './OfflineIndicator'

describe('OfflineIndicator', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })
  })

  it('does not render when online', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <OfflineIndicator />
      </I18nextProvider>
    )
    expect(screen.queryByTestId('offline-indicator')).not.toBeInTheDocument()
  })

  it('renders when offline', () => {
    Object.defineProperty(navigator, 'onLine', { writable: true, value: false })
    render(
      <I18nextProvider i18n={i18n}>
        <OfflineIndicator />
      </I18nextProvider>
    )
    expect(screen.getByTestId('offline-indicator')).toBeInTheDocument()
    expect(screen.getByText(/You are offline/)).toBeInTheDocument()
  })

  it('shows Serbian message when language is sr', async () => {
    await i18n.changeLanguage('sr')
    Object.defineProperty(navigator, 'onLine', { writable: true, value: false })
    render(
      <I18nextProvider i18n={i18n}>
        <OfflineIndicator />
      </I18nextProvider>
    )
    expect(screen.getByText(/Niste povezani na internet/)).toBeInTheDocument()
  })
})
