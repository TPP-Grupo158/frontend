const API_URL = process.env.TEST_API_URL

export const userIsAuthenticated = async (page) => {
  await page.route(`${API_URL}/auth`, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Authentication successful' }),
    });
  });
}

export const userIsAdminWithLocalStorage = async (page) => {
  await page.route(`${API_URL}/auth`, route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Authentication successful' }) });
  });
  await page.addInitScript(() => {
    localStorage.setItem('user_info', JSON.stringify({ role: 'admin', must_change_password: false }));
  });
};

export const userIsAuthenticatedNeedsChangePassword = async (page) => {
  await page.route(`${API_URL}/auth`, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Authentication successful', must_change_password: true, role: 'doctor' }),
    });
  });
}

export const userIsNotAuthenticated = async (page) => {
  await page.route(`${API_URL}/auth`, route => {
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Authentication failed' }),
    });
  });
}

export const mockResponse = async (page, url, status, body) => {
  await page.route(url, route => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    }
    return route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export const waitForResponseWithUrl = async (page, url, method) => {
  const filteredResponse = page.waitForResponse((res) =>
    res.url().includes(url) &&
    res.request().method() === method
  );
  return filteredResponse;
}

export const getMockPatients = (count, letterToRepeat) => {
  return Array.from({ length: count }, (_, i) => ({
    'fullname': `Patient ${letterToRepeat.repeat(i)}`,
    'dni': `123456${(i + 1).toString().padStart(2, '0')}`,
    'email': `${letterToRepeat}${i + 1}@example.com`,
    'date_of_birth': new Date(1980, 0, i + 1).toISOString().split('T')[0]
  }));
};

export const mockNetworkError = async (page, url, method) => {
    await page.route(url, async (route) => {
    if (route.request().method() === method) {
      await route.abort('connectionrefused');
      return;
    }
    await route.continue();
  });
}