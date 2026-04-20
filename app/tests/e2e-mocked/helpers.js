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

