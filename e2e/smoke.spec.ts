import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('home loads with main heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: /application/i })).toBeVisible()
    await expect(page.getByRole('searchbox', { name: /search/i })).toBeVisible()
  })

  test('navigates to Settings via hash', async ({ page }) => {
    await page.goto('/#settings')
    await expect(page.getByRole('heading', { level: 1, name: /settings/i })).toBeVisible()
  })

  test('navigates to Profile via hash', async ({ page }) => {
    await page.goto('/#profile')
    await expect(page.getByRole('heading', { level: 1, name: /profile/i })).toBeVisible()
  })

  test('switches language to Serbian', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: /language/i }).selectOption('sr')
    await expect(page.getByRole('heading', { level: 1, name: /aplikacija/i })).toBeVisible()
  })

  test('logout clears profile data and shows message', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('app-profile-name', 'E2E User')
      localStorage.setItem('app-profile-email', 'e2e@test.com')
    })
    await page.reload()
    await page.getByRole('button', { name: /log out/i }).click()
    await expect(page.getByText(/you have been logged out/i)).toBeVisible()
    const name = await page.evaluate(() => localStorage.getItem('app-profile-name'))
    const email = await page.evaluate(() => localStorage.getItem('app-profile-email'))
    expect(name).toBeNull()
    expect(email).toBeNull()
  })
})
