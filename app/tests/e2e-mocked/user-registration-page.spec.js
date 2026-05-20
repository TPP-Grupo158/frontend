import { test, expect } from '@playwright/test';
import { userIsAdminWithLocalStorage, mockResponse, waitForResponseWithUrl } from './helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';



test('Admin user can register new user', async ({ page }) => {

  await userIsAdminWithLocalStorage(page);

  await mockResponse(page, `${API_URL}/register`, 200, {
      user_id: 123,
      role: 'doctor',
      must_change_password: true,
      temp_password: 'tempPass123!'
   });

  //since everything is saved on userContext, we can't just navigate to the page
  await page.goto(`${BASE_URL}/users`);

  const userFullnameInput = page.getByPlaceholder('Fullname');
  const userEmailInput = page.getByPlaceholder('Email');
  const submitButton = page.getByRole('button', { name: 'Create' });

  await userFullnameInput.fill('John Doe');
  await userEmailInput.fill('john.doe@example.com');

  const registerUserResponse = waitForResponseWithUrl(page, '/register', 'POST');
  await submitButton.click();
  const response = await registerUserResponse;

  expect(response.status()).toBe(200);
});

