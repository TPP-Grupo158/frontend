import { test, expect } from '@playwright/test';
import { userIsAuthenticated, userIsNotAuthenticated, mockResponse, waitForResponseWithUrl } from '../helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';


test('When user token expires its shown message to log in again', async ({ page }) => {
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: true });

  const dniFilterContent = '12345670';

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 401, { message: 'Token expired' });

  await page.goto(`${BASE_URL}/patients`);
  
  const waitForPatientsResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await waitForPatientsResponse

  const errorMessage = page.getByText('Your session has expired. Please log in again.');
  await expect(errorMessage).toBeVisible();
});

test('When user token expires user can select button to go to login page', async ({ page }) => {
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: true });

  const dniFilterContent = '12345670';

  // Simulate token expiration by returning a 401 for the patients API
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 401, { message: 'Token expired' });

  await page.goto(`${BASE_URL}/patients`);
  await waitForResponseWithUrl(page, `/patients?offset=0&limit=10`, 'GET');
  
  const waitForPatientsResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await waitForPatientsResponse

  await userIsNotAuthenticated(page);
  const navButton = page.getByText('Go to Login');
  await expect(navButton).toBeVisible();
  await navButton.click();
  
  await expect(page).toHaveURL(`${BASE_URL}/login`);
});