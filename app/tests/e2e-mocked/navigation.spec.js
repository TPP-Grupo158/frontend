import { test, expect } from '@playwright/test';
import { userIsAuthenticated, mockResponse,  } from './helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('When user goes to non existing page it redirects to patients page', async ({ page }) => {
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: true });

  await page.goto(`${BASE_URL}/non-existing-page`);
  await page.waitForURL(`${BASE_URL}/patients`);

  await expect(page.getByRole('heading', { name: 'Patient Search' })).toBeVisible();
});

test('When user goes to non existing page and it is not authorized, it redirects to login', async ({ page }) => {

  await page.goto(`${BASE_URL}/non-existing-page`);
  await page.waitForURL(`${BASE_URL}/login`);

  await expect(page.getByText('Please sign in to continue')).toBeVisible();
});
