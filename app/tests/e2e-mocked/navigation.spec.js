import { test, expect } from '@playwright/test';
import { userIsAuthenticated, mockResponse, userIsNotAuthenticated  } from './helpers';

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

test('When user logs out, it redirects to login page', async ({ page }) => {
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/logout`, 200, { success: true });
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: true });

  await page.goto(`${BASE_URL}/patients`);
  await page.waitForResponse(response =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );

  const logoutButton = page.getByTestId('logout-button');
  await userIsNotAuthenticated(page);

  await logoutButton.click();
  await page.waitForURL(`${BASE_URL}/login`);

  await expect(page.getByText('Please sign in to continue')).toBeVisible();
});

test('When user logs out, it clears the local storage', async ({ page }) => {
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/logout`, 200, { success: true });
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: true });

  await page.goto(`${BASE_URL}/patients`);
  await page.waitForResponse(response =>
    response.url().includes('/auth') && response.request().method() === 'POST'
  );

  const logoutButton = page.getByTestId('logout-button');
  await userIsNotAuthenticated(page);
  
  await logoutButton.click();
  await page.waitForURL(`${BASE_URL}/login`);

  const userInfo = await page.evaluate(() => localStorage.getItem('user_info'));
  expect(userInfo).toBeNull();
});