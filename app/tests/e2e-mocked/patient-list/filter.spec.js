import { test, expect } from '@playwright/test';
import { userIsAuthenticated, getMockPatients, mockResponse, waitForResponseWithUrl } from '../helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';


test('User can filter by DNI', async ({ page }) => {

  const patients = getMockPatients(5, 'a')
  const dniFilterContent = '123456'

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 200, { patients, hasMore: false });

  await page.goto(`${BASE_URL}/patients`);

  const filteredResponse =  waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await filteredResponse

  // DNI is column 1 in your table
  const dniCells = page.locator('table tbody tr td:nth-child(1)');
  const dnis = (await dniCells.allTextContents())
    .map(t => t.trim())
    .filter(Boolean);

  expect(dnis.length).toBeGreaterThan(0);
  for (const dni of dnis) {
    expect(dni.startsWith(dniFilterContent)).toBeTruthy();
  }
});

test('User can filter by Name', async ({ page }) => {

  const patients = getMockPatients(5, 'a')
  const nameFilterContent = `Patient ` + 'a'.repeat(3);

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await mockResponse(page, 
    `${API_URL}/patients?offset=0&limit=10&name=${encodeURIComponent(nameFilterContent)}`, 
    200, 
    { patients: patients.filter(p => p.fullname.includes(nameFilterContent)), hasMore: false }
  );

  await page.goto(`${BASE_URL}/patients`);

  const filterSelect = page.getByRole('combobox');
  await filterSelect.selectOption('Name');
  
  const filteredResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&name=${encodeURIComponent(nameFilterContent)}`, 'GET');
  const nameFilterInput = page.getByPlaceholder('Search by Name');
  await nameFilterInput.fill(nameFilterContent);
  await filteredResponse

  // Name is column 2 in your table
  const nameCells = page.locator('table tbody tr td:nth-child(2)');
  const names = (await nameCells.allTextContents())
    .map(t => t.trim())
    .filter(Boolean);

  expect(names.length).toBeLessThan(3);
  for (const name of names) {
    expect(name.includes(nameFilterContent)).toBeTruthy();
  }
});

test('Clearing filter restores original patient list', async ({ page }) => {

  const patients = getMockPatients(10, 'a')

  const dniFilterContent = '123456'

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 200, { patients, hasMore: false });

  await page.goto(`${BASE_URL}/patients`);

  const filteredResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await filteredResponse

  const clearFilterResponse = page.waitForResponse((res) =>
    res.url().includes(`/patients?offset=0&limit=10`) &&
    res.request().method() === 'GET'
  );

  await dniFilterInput.clear();
  await clearFilterResponse;

  // DNI is column 1 in your table
  const dniCells = page.locator('table tbody tr td:nth-child(1)');
  const dnis = (await dniCells.allTextContents())
    .map(t => t.trim())
    .filter(Boolean);

  expect(dnis.length).toBe(patients.length);
});

test('No patients found when filter returns no results', async ({ page }) => {

  const patients = getMockPatients(10, 'a')
  const dniFilterContent = '98765432';

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 200, { patients: [], hasMore: false });

  await page.goto(`${BASE_URL}/patients`);

  const filteredResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await filteredResponse

  const noPatientsMessage = page.getByText('No patients found'); 
  await expect(noPatientsMessage).toBeVisible();
});

//Test skipped since the fix is on another branch and this test will fail until that fix is merged.
test.fixme('Error message is shown when filter returns error', async ({ page }) => {

  const patients = getMockPatients(10, 'a')
  const dniFilterContent = '98765432';

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await mockResponse(page, 
    `${API_URL}/patients?offset=0&limit=10&dni=${dniFilterContent}`, 
    500, 
    { error: 'There was a problem communicating with the server.' }
  );

  await page.goto(`${BASE_URL}/patients`);

  const filteredResponse = waitForResponseWithUrl(page, `/patients?offset=0&limit=10&dni=${dniFilterContent}`, 'GET');
  const dniFilterInput = page.getByPlaceholder('Search by DNI');
  await dniFilterInput.fill(dniFilterContent);
  await filteredResponse

  const errorMessage = page.getByText('There was a problem communicating with the server.');
  await expect(errorMessage).toBeVisible();
});

test('DNI filter input only accepts numbers', async ({ page }) => {

  const patients = getMockPatients(10, 'a')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await page.goto(`${BASE_URL}/patients`);

  const filterSelect = page.getByRole('combobox');
  await filterSelect.selectOption('DNI');
  
  const dniFilterInput = page.getByPlaceholder('Search by DNI');

  await dniFilterInput.fill('abc123!@#');
  expect(await dniFilterInput.inputValue()).toBe('123');
});

test('Name filter input accepts letters', async ({ page }) => {
  const patients = getMockPatients(10, 'a')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await page.goto(`${BASE_URL}/patients`);

  const filterSelect = page.getByRole('combobox');
  await filterSelect.selectOption('Name');
  
  const dniFilterInput = page.getByPlaceholder('Search by Name');

  await dniFilterInput.fill('abc123!@#');
  expect(await dniFilterInput.inputValue()).toBe('abc');
});

test("Name filter input accepts .-' as valid characters" , async ({ page }) => {
  const patients = getMockPatients(10, 'a')

  await userIsAuthenticated(page);

  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: true });

  await page.goto(`${BASE_URL}/patients`);

  const filterSelect = page.getByRole('combobox');
  await filterSelect.selectOption('Name');
  
  const dniFilterInput = page.getByPlaceholder('Search by Name');

  await dniFilterInput.fill("John O'Connor-Smith Jr.");
  expect(await dniFilterInput.inputValue()).toBe("John O'Connor-Smith Jr.");
});