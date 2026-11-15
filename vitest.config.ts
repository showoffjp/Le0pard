import { defineConfig } from 'vitest/config'

// Unit tests cover the pure logic only (no DOM/WebGL), so the fast node
// environment is enough. Test files live next to the code they cover as
// src/**/*.test.ts and are never part of the production build (nothing imports
// them from the app entry).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
