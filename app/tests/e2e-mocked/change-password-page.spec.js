import { test, expect } from '@playwright/test';
import { userIsAuthenticated, mockResponse, waitForResponseWithUrl } from './helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('User can change password', async ({ page }) => {

  const currentPassword = 'currentPassword123!';
  const newPassword = 'newPassword123!';
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/change-password`, 200, { message: 'Password changed successfully' });

  await page.goto(`${BASE_URL}/change-password`);

  const currentPasswordInput = page.getByPlaceholder('Current Password');
  const newPasswordInput = page.getByPlaceholder('New Password', { exact: true });
  const confirmPasswordInput = page.getByPlaceholder('Confirm New Password');
  const submitButton = page.getByRole('button', { name: 'Change Password' });

  await currentPasswordInput.fill(currentPassword);
  await newPasswordInput.fill(newPassword);
  await confirmPasswordInput.fill(newPassword);

  const changePasswordResponse = waitForResponseWithUrl(page, '/change-password', 'POST');
  await submitButton.click();
  const response = await changePasswordResponse;

  expect(response.status()).toBe(200);
});


test('User navigates to patients page after successful password change', async ({ page }) => {

  const currentPassword = 'currentPassword123!';
  const newPassword = 'newPassword123!';
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/change-password`, 200, { message: 'Password changed successfully' });

  await page.goto(`${BASE_URL}/change-password`);

  const currentPasswordInput = page.getByPlaceholder('Current Password');
  const newPasswordInput = page.getByPlaceholder('New Password', { exact: true });
  const confirmPasswordInput = page.getByPlaceholder('Confirm New Password');
  const submitButton = page.getByRole('button', { name: 'Change Password' });

  await currentPasswordInput.fill(currentPassword);
  await newPasswordInput.fill(newPassword);
  await confirmPasswordInput.fill(newPassword);

  const changePasswordResponse = waitForResponseWithUrl(page, '/change-password', 'POST');
  await submitButton.click();
  await changePasswordResponse;

  await expect(page).toHaveURL(`${BASE_URL}/patients`);
});
