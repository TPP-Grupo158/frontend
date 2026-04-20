import { test, expect } from '@playwright/test';
import { userIsAuthenticated, mockResponse} from '../helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('Patients are shown on the table in PatientList', async ({ page }) => {

  //user is autenticated and can access the patient search page
  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, {
      patients: [
        { 'fullname': 'John Doe', 'dni': '12345678', 'email': 'john.doe@example.com', 'date_of_birth': '1980-01-01' },
      ], 
      hasMore: false 
  });
  await page.goto(`${BASE_URL}/patients`);


  const row = page.locator('table tbody tr').filter({ hasText: 'John Doe' });
  const patient1 = await row.first().innerText();

  await expect(page.getByRole('heading', { name: 'Patient Search' })).toBeVisible();
  await expect(patient1).toContain('John Doe');
  await expect(patient1).toContain('12345678');
  await expect(patient1).toContain('1980-01-01');
});

test('Error message is shown when patient search fails', async ({ page }) => {

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 500, { message: 'Internal Server Error' });

  await page.goto(`${BASE_URL}/patients`);
  const errorMessage = page.getByText('Internal Server Error');
  await expect(errorMessage).toBeVisible();
});

test('When there are no patients found', async ({ page }) => {

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients: [], hasMore: false });

  await page.goto(`${BASE_URL}/patients`);
  const patients = page.getByText('No patients found');
  await expect(patients).toBeVisible();
});
