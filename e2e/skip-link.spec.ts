import { test, expect } from '@playwright/test'

test.describe('skip link', () => {
  test('activating skip link moves focus to main content', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await skip.focus()
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })
})
