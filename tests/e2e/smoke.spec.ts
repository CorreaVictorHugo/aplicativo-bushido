import { test, expect } from '@playwright/test'

test('smoke: tela de login carrega', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toContainText('Entrar')
  await expect(page.locator('#email')).toBeVisible()
  await expect(page.locator('#password')).toBeVisible()
})
