import { test, expect } from '@playwright/test';
import { userIsAuthenticated, getMockPatients, mockResponse } from '../helpers';

const API_URL = process.env.TEST_API_URL
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';


test('New patient button opens new patient form', async ({ page }) => {

  const patients = getMockPatients(5, 'a')

  //user is autenticated and can access the patient search page
  await userIsAuthenticated(page);

  // First load the page with some patients
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: false })

  await page.goto(`${BASE_URL}/patients`);
  
  const newPatientButton = page.getByRole('button', { name: 'New Patient' });
  await newPatientButton.click();

  const newPatientForm = page.getByTestId('patient-form');
  const formTitle = page.getByRole('heading', { name: 'Create new patient' });

  await expect(formTitle).toHaveText('Create new patient');
  await expect(newPatientForm).toBeVisible();

  const fullnameInput = newPatientForm.getByPlaceholder('Fullname');
  const dniInput = newPatientForm.getByPlaceholder('DNI');
  const emailInput = newPatientForm.getByPlaceholder('Email');
  const dateOfBirthInput = newPatientForm.getByPlaceholder('Date of Birth');

  await expect(fullnameInput).toBeVisible();
  await expect(dniInput).toBeVisible();
  await expect(emailInput).toBeVisible();
  await expect(dateOfBirthInput).toBeVisible();
});

test('Cancel button on new patient form closes the form', async ({ page }) => {

  const patients = getMockPatients(5, 'a')

  //user is autenticated and can access the patient search page
  await userIsAuthenticated(page);

  // First load the page with some patients
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: false })

  await page.goto(`${BASE_URL}/patients`);
  
  const newPatientButton = page.getByRole('button', { name: 'New Patient' });
  await newPatientButton.click();

  const newPatientForm = page.getByTestId('patient-form');

  const closeButton = newPatientForm.getByRole('button', { name: 'Cancel' });
  await closeButton.click();

  await expect(newPatientForm).not.toBeVisible();
});

test('Creating new valid patient', async ({ page }) => {

  const patients = getMockPatients(5, 'a')

  //user is autenticated and can access the patient search page
  await userIsAuthenticated(page);

  // First load the page with some patients
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: false })

  await mockResponse(page, `${API_URL}/patients/`, 201, {})

  await page.goto(`${BASE_URL}/patients`);
  
  const newPatientButton = page.getByRole('button', { name: 'New Patient' });
  await newPatientButton.click();

  const newPatientForm = page.getByTestId('patient-form');

  await newPatientForm.getByPlaceholder('Fullname').fill('Roberto Gonzales');
  await newPatientForm.getByPlaceholder('DNI').fill('12345678');
  await newPatientForm.getByPlaceholder('Email').fill('test@email.com');
  await newPatientForm.getByPlaceholder('Date of Birth').fill('1980-01-01');

  const submitButton = newPatientForm.getByRole('button', { name: 'Create' });
  await submitButton.click();

  const successMessage = page.getByText('Patient created successfully');
  await expect(successMessage).toBeVisible();
  await expect(newPatientForm).not.toBeVisible();
});


test('Creating new patient with existing DNI', async ({ page }) => {

  const patients = getMockPatients(5, 'a')
  //user is autenticated and can access the patient search page
  await userIsAuthenticated(page);

  // First load the page with some patients
  await mockResponse(page, `${API_URL}/patients?offset=0&limit=10`, 200, { patients, hasMore: false })

  await mockResponse(page, `${API_URL}/patients/`, 409, {})

  await page.goto(`${BASE_URL}/patients`);
  
  const newPatientButton = page.getByRole('button', { name: 'New Patient' });
  await newPatientButton.click();

  const newPatientForm = page.getByTestId('patient-form');

  const fullnameInput = newPatientForm.getByPlaceholder('Fullname');
  const dniInput = newPatientForm.getByPlaceholder('DNI');
  const emailInput = newPatientForm.getByPlaceholder('Email');
  const dateOfBirthInput = newPatientForm.getByPlaceholder('Date of Birth');

  await fullnameInput.fill('Patient Test'); 
  await dniInput.fill('12345670');
  await emailInput.fill('test@email.com');
  await dateOfBirthInput.fill('1980-01-01');

  const submitButton = newPatientForm.getByRole('button', { name: 'Create' });
  await submitButton.click();

  const errorMessage = page.getByText('A patient with the same DNI has already been registered.');
  await expect(errorMessage).toBeVisible();
  await expect(newPatientForm).toBeVisible();
});
