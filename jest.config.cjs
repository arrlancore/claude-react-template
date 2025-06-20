/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'app/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  testTimeout: 30000, // 30 seconds for AI API calls
  verbose: true,
  // Handle ES modules in dependencies
  transformIgnorePatterns: [
    'node_modules/(?!(@google/generative-ai)/)'
  ]
};
