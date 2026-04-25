import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.unit.{js,ts,jsx,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      'tests/e2e-mocked/**',
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
})