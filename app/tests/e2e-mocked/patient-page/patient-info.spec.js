import { test, expect } from '@playwright/test';
import { userIsAuthenticated, getMockPatients, mockResponse, waitForResponseWithUrl } from '../helpers';
import { getAge } from '../../../src/helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('Patient details page shows patient name', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 200, { ...patient });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const patientName = await page.getByTestId('patient-name').textContent();
  expect(patientName).toBe(patient.fullname);
});

test('Patient details page shows patient dni', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 200, { ...patient });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const patientDni = await page.getByTestId('patient-dni').textContent();
  expect(patientDni).toBe(patient.dni);
});

test('Patient details page shows patient age', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 200, { ...patient });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const patientAge = await page.getByTestId('patient-age').textContent();
  expect(patientAge).toContain(`${getAge(patient.date_of_birth)}`);
});

test('Patient details page shows patient date of birth after the age', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 200, { ...patient });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const patientAge = await page.getByTestId('patient-age').textContent();
  expect(patientAge).toContain(`(${patient.date_of_birth})`);
});

test('Patient details page shows patient shows patient email', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 200, { ...patient });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const patientEmail = await page.getByTestId('patient-email').textContent();
  expect(patientEmail).toBe(patient.email);
});

test('Patient details page shows error when patient data is not found ', async ({ page }) => {
  const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 404, { message: 'Patient not found' });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const errorMessage = await page.getByText('Failed to retrieve patient information').textContent();
  expect(errorMessage).toBe('Failed to retrieve patient information');
});

test('Patient details page shows error when there is a server error', async ({ page }) => {
    const patient = getMockPatients(1, 'a')[0];
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients/${patient.dni}`, 500, { message: 'Internal Server Error' });
  const waitForPatientsResponse = waitForResponseWithUrl(page, `${API_URL}/patients/${patient.dni}`, 'GET');

  await page.goto(`${BASE_URL}/patients/${patient.dni}`);
  await waitForPatientsResponse

  const errorMessage = await page.getByText('Failed to retrieve patient information').textContent();
  expect(errorMessage).toBe('Failed to retrieve patient information');
});