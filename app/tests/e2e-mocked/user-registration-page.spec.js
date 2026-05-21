import { test, expect } from '@playwright/test';
import { userIsAdminWithLocalStorage, mockResponse, waitForResponseWithUrl, mockNetworkError } from './helpers';

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

test('Displays error message on registration failure', async ({ page }) => {

  await userIsAdminWithLocalStorage(page);

  await mockResponse(page, `${API_URL}/register`, 400, {
      detail: 'Email already exists'
   });

  await page.goto(`${BASE_URL}/users`);

  const userFullnameInput = page.getByPlaceholder('Fullname');
  const userEmailInput = page.getByPlaceholder('Email');
  const submitButton = page.getByRole('button', { name: 'Create' });

  await userFullnameInput.fill('John Doe');
  await userEmailInput.fill('john.doe@example.com');
  await submitButton.click();
  const errorMessage = page.getByText('Email already exists');

  await expect(errorMessage).toBeVisible();

});

test('Error message can be closed', async ({ page }) => {

  await userIsAdminWithLocalStorage(page);

  await mockResponse(page, `${API_URL}/register`, 400, {
      detail: 'Email already exists'
   });

  await page.goto(`${BASE_URL}/users`);

  const userFullnameInput = page.getByPlaceholder('Fullname');
  const userEmailInput = page.getByPlaceholder('Email');
  const submitButton = page.getByRole('button', { name: 'Create' });

  await userFullnameInput.fill('John Doe');
  await userEmailInput.fill('john.doe@example.com');
  await submitButton.click();
  const errorMessage = page.getByText('Email already exists');

  await expect(errorMessage).toBeVisible();
  await page.getByText('×').click();
  await expect(errorMessage).not.toBeVisible();
});

test('Error message is not shown after successful registration', async ({ page }) => {

  await userIsAdminWithLocalStorage(page);

  await mockResponse(page, `${API_URL}/register`, 400, {
      detail: 'Email already exists'
   });

  await page.goto(`${BASE_URL}/users`);

  const userFullnameInput = page.getByPlaceholder('Fullname');
  const userEmailInput = page.getByPlaceholder('Email');
  const submitButton = page.getByRole('button', { name: 'Create' });

  await userFullnameInput.fill('John Doe');
  await userEmailInput.fill('john.doe@example.com');
  await submitButton.click();
  
  const errorMessage = page.getByText('Email already exists');
  await expect(errorMessage).toBeVisible();

  userEmailInput.fill('jane.doe@example.com');

  await mockResponse(page, `${API_URL}/register`, 200, {
      user_id: 123,
      role: 'doctor',
      must_change_password: true,
      temp_password: 'tempPass123!'
   });

  await submitButton.click();
  await expect(errorMessage).not.toBeVisible();

});


test('Error message is shown on network failure', async ({ page }) => {

  await userIsAdminWithLocalStorage(page);

  await mockNetworkError(page, `${API_URL}/register`, 'POST');

  await page.goto(`${BASE_URL}/users`);

  const userFullnameInput = page.getByPlaceholder('Fullname');
  const userEmailInput = page.getByPlaceholder('Email');
  const submitButton = page.getByRole('button', { name: 'Create' });

  await userFullnameInput.fill('John Doe');
  await userEmailInput.fill('john.doe@example.com');
  await submitButton.click();

  const errorMessage = page.getByText('Failed to create user');
  await expect(errorMessage).toBeVisible();
});
