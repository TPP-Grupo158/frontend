import { test, expect } from '@playwright/test';
import { userIsAuthenticated, mockResponse, mockNetworkError, userIsAuthenticatedNeedsChangePassword } from './helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('When user logs in, its shown the patient search page', async ({ page }) => {

  await mockResponse(page, `${API_URL}/login`, 200, { message: 'Login successful', must_change_password: false });
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: false });

  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('Email').fill('user@example.com');
  await page.getByPlaceholder('Password').fill('securePassword123!');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await userIsAuthenticated(page);
  await page.waitForURL(`${BASE_URL}/patients`);

  await expect(page.getByRole('heading', { name: 'Patient Search' })).toBeVisible();
});

test('User logs in with invalid credentials', async ({ page }) => {

  await mockResponse(page, `${API_URL}/login`, 401, { message: 'Invalid credentials' });

  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('Email').fill('user@example.com');
  await page.getByPlaceholder('Password').fill('wrongPassword');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.getByRole('heading', { name: 'Patient Search' })).not.toBeVisible({timeout: 1000});
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('User logs in when server is unavailable', async ({ page }) => {

  await mockNetworkError(page, `${API_URL}/login`, 'POST');

  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('Email').fill('user@example.com');
  await page.getByPlaceholder('Password').fill('wrongPassword');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.getByRole('heading', { name: 'Patient Search' })).not.toBeVisible({timeout: 1000});
  await expect(page.getByText('Could not connect to the server.')).toBeVisible();
});

test('User is already logged in navigates to patient page', async ({ page }) => {

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: false });

  await userIsAuthenticated(page);
  await page.goto(`${BASE_URL}/login`);
  await page.waitForURL(`${BASE_URL}/patients`);

  await page.waitForURL(`${BASE_URL}/patients`);
  await expect(page.getByRole('heading', { name: 'Patient Search' })).toBeVisible();
});

test('User logs in for first time and is redirected to change password page', async ({ page }) => {

  await mockResponse(page, `${API_URL}/login`, 200, { message: 'Login successful', must_change_password: true });

  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('Email').fill('user@example.com');
  await page.getByPlaceholder('Password').fill('securePassword123!');
  await page.getByRole('button', { name: 'Login' }).click();

  await userIsAuthenticatedNeedsChangePassword(page);

  await page.waitForURL(`${BASE_URL}/change-password`);
  await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();
});
