/**
 * E2E: Admin leaderboard CRUD and front-end verification.
 * Requires .env.local with ADMIN_EMAIL and ADMIN_PASSWORD for login.
 * Run: npx playwright test e2e/admin-leaderboard.spec.ts
 * Dev server: use baseURL http://localhost:3002 (set PORT=3002 or use PLAYWRIGHT_BASE_URL).
 */
import { config } from 'dotenv';
import path from 'path';
import { test, expect } from '@playwright/test';

config({ path: path.resolve(process.cwd(), '.env.local') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('Admin leaderboard', () => {
  test.beforeEach(async ({ page }) => {
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      await page.goto('/admin/login');
      await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
      await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page).toHaveURL(/\/admin/);
    }
  });

  test('unauthenticated redirects to login', async ({ page, context }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3002';
    test.skip(baseURL.includes('localhost'), 'In dev (localhost), middleware allows admin access without login');
    await context.clearCookies();
    await page.goto('/admin/leaderboard');
    await expect(page).toHaveURL(/\/admin\/login/);
    expect(page.url()).toContain('callbackUrl');
  });

  test('login page shows form and rejects invalid credentials', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/admin/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrong');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('leaderboard list and period selector', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    await expect(page.getByRole('heading', { name: /leaderboard management/i })).toBeVisible();
    await expect(page.getByText('Period:')).toBeVisible();
    const table = page.getByRole('table');
    await expect(table.locator('th').filter({ hasText: /rank/i })).toBeVisible();
    await expect(table.locator('th').filter({ hasText: /player/i })).toBeVisible();
    await expect(table.locator('th').filter({ hasText: /wagered/i })).toBeVisible();
    await expect(table.locator('th').filter({ hasText: /actions/i })).toBeVisible();
  });

  test('create entry then verify on front end', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    const uniqueName = `E2E Player ${Date.now()}`;
    await page.getByRole('button', { name: /add entry/i }).first().click();
    await expect(page.getByRole('heading', { name: /add entry/i })).toBeVisible();
    const form = page.locator('form').first();
    await form.getByLabel(/player name/i).fill(uniqueName);
    await form.getByLabel(/^rank/i).fill('99');
    await form.getByLabel(/total wagered/i).fill('1000');
    await form.getByLabel(/biggest win/i).fill('100');
    await form.getByLabel(/current streak/i).fill('1');
    await form.getByLabel(/platform/i).selectOption('stake_us');
    await form.getByRole('button', { name: /add entry/i }).click();
    await expect(page.getByText(/entry added/i)).toBeVisible();
    await expect(page.getByRole('cell', { name: uniqueName })).toBeVisible();

    await page.getByRole('button', { name: /publish this period/i }).click();
    await page.getByRole('button', { name: /^publish$/i }).click();
    await expect(page.getByText(/leaderboard published/i)).toBeVisible();

    await page.goto('/leaderboard');
    await expect(page.getByRole('heading', { name: /casino leaderboard/i })).toBeVisible();
    const row = page.getByRole('row', { name: new RegExp(uniqueName) });
    await expect(row).toBeVisible();
  });

  test('update entry', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    const table = page.getByRole('table');
    const firstEdit = page.getByRole('button', { name: /edit/i }).first();
    if (await firstEdit.isVisible()) {
      await firstEdit.click();
      const nameInput = page.getByRole('textbox', { name: /player name/i }).first();
      await nameInput.clear();
      const updatedName = `Updated ${Date.now()}`;
      await nameInput.fill(updatedName);
      await page.getByRole('button', { name: /save/i }).click();
      await expect(page.getByText(/entry updated/i)).toBeVisible();
      await expect(table.getByRole('cell', { name: updatedName })).toBeVisible();
    }
  });

  test('delete confirmation dialog and cancel', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('heading', { name: /delete leaderboard entry/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
      await page.getByRole('button', { name: /cancel/i }).click();
      await expect(page.getByRole('heading', { name: /delete leaderboard entry/i })).not.toBeVisible();
    }
  });

  test('publish confirmation dialog and cancel', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    await page.getByRole('button', { name: /publish this period/i }).click();
    await expect(page.getByRole('heading', { name: /publish this period/i })).toBeVisible();
    await expect(page.getByText(/will appear on the public leaderboard/i)).toBeVisible();
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('heading', { name: /publish this period/i })).not.toBeVisible();
  });

  test('publish period then verify on front end', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
    await page.goto('/admin/leaderboard');
    await page.getByRole('button', { name: /publish this period/i }).click();
    await page.getByRole('button', { name: /^publish$/i }).click();
    await expect(page.getByText(/leaderboard published/i)).toBeVisible();

    await page.goto('/');
    await expect(page.getByRole('heading', { name: /\$150,000.*high stakes leaderboard/i })).toBeVisible();
    await page.goto('/leaderboard');
    await expect(page.getByRole('heading', { name: /casino leaderboard/i })).toBeVisible();
  });
});
