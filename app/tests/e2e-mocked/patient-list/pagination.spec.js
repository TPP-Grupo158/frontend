import { test, expect } from '@playwright/test';
import { userIsAuthenticated, getMockPatients, mockResponse, waitForResponseWithUrl } from '../helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';


test('When the page is not full, next page button is disabled', async ({ page }) => {

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: getMockPatients(1, 'a'), hasMore: false });

  await page.goto(`${BASE_URL}/patients`);
  const nextPageButton = page.getByRole('button', { name: '>' });
  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).toBeDisabled();
});

test('Previous page button is disabled on the first page', async ({ page }) => {

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: getMockPatients(1, 'a'), hasMore: false });

  await page.goto(`${BASE_URL}/patients`);
  const prevPageButton = page.getByRole('button', { name: '<' });
  await expect(prevPageButton).toBeVisible();
  await expect(prevPageButton).toBeDisabled();
});

test('When the page is full and there are more patients, next page button is enabled', async ({ page }) => {

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: getMockPatients(10, 'a'), hasMore: true });

  await page.goto(`${BASE_URL}/patients`);

  const nextPageButton = page.getByRole('button', { name: '>' });
  const page_number = page.getByTestId('patient-pagination-page-num');
  await expect(page_number).toHaveText('1');
  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).not.toBeDisabled();
});

test('When changing pages from patient list, different patients are shown', async ({ page }) => {

  const patients = getMockPatients(10, 'a')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });
  await mockResponse(page, `${API_URL}/patients?offset=10&limit=10`, 200, {
     patients: [
        { 'fullname': 'Patient Test', 'dni': '123456789', 'email': 'patient11@example.com', 'date_of_birth': '1980-01-01' },
      ], 
     hasMore: false 
  });

  await page.goto(`${BASE_URL}/patients`);

  const nextPageButton = page.getByRole('button', { name: '>' });
  await nextPageButton.click();

  const page_number = page.getByTestId('patient-pagination-page-num');
  await expect(page_number).toHaveText('2');
  await expect(page.getByText('Patient Test')).toBeVisible();

  for (const p of patients) {
    await expect(page.getByText(p.fullname, { exact: true })).not.toBeVisible();
  }
});

test('Can change pages multiple times', async ({ page }) => {

  const patients = getMockPatients(10, 'a')
  const patientsPage2 = getMockPatients(10, 'b')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });
  await mockResponse(page, `${API_URL}/patients?offset=10&limit=10`, 200, { patients: patientsPage2, hasMore: true });
  await mockResponse(page, `${API_URL}/patients?offset=20&limit=10`, 200, {
     patients: [
        { 'fullname': 'Patient Test', 'dni': '123456789', 'email': 'patient11@example.com', 'date_of_birth': '1980-01-01' },
      ], 
     hasMore: false 
  });

  await page.goto(`${BASE_URL}/patients`);

  const nextPageButton = page.getByRole('button', { name: '>' });

  const amountOfPagesToGo = 2;
  for (let i = 0; i<amountOfPagesToGo; i++) {
    const waitForPatientsResponse = waitForResponseWithUrl(page, `/patients?`, 'GET');
    await nextPageButton.click();
    await waitForPatientsResponse;
  }
  
  const page_number = page.getByTestId('patient-pagination-page-num');
  await expect(page_number).toHaveText(`${amountOfPagesToGo + 1}`);
  await expect(page.getByText('Patient Test')).toBeVisible();
});

test('When changing pages from patient list, can go to prev page', async ({ page }) => {

  const patients = getMockPatients(10, 'a')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });
  await mockResponse(page, `${API_URL}/patients?offset=10&limit=10`, 200, {
    patients: [
      { 'fullname': 'Patient Test', 'dni': '123456789', 'email': 'patient11@example.com', 'date_of_birth': '1980-01-01' },
    ],
    hasMore: false
  });

  await page.goto(`${BASE_URL}/patients`);

  const nextPageButton = page.getByRole('button', { name: '>' });
  const prevPageButton = page.getByRole('button', { name: '<' });
  await nextPageButton.click();
  await prevPageButton.click();

  const page_number = page.getByTestId('patient-pagination-page-num');
  await expect(page_number).toHaveText('1');
  await expect(page.getByText('Patient Test')).not.toBeVisible();
  for (const p of patients) {
    await expect(page.getByText(p.fullname, { exact: true })).toBeVisible();
  }
});