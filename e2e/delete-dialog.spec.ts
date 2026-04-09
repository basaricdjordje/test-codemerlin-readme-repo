import { test, expect } from '@playwright/test'

test.describe('contact form delete dialog', () => {
  test('dialog is modal, closes on Escape, and traps focus with Shift+Tab', async ({ page }) => {
    await page.goto('/')
    const form = page.getByTestId('contact-form')
    await form.getByTestId('contact-delete-open').click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)

    await form.getByTestId('contact-delete-open').click()
    const cancel = dialog.getByRole('button', { name: /cancel/i })
    const deleteConfirm = dialog.getByRole('button', { name: /^delete$/i })
    await cancel.focus()
    await expect(cancel).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(deleteConfirm).toBeFocused()
  })
})
