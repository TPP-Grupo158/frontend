import { defineConfig, configDefaults } from 'vitest/config'
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
       "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
       '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
    },
  },
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