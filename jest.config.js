const nextJest = require('next/jest');

// Configure Jest for Next.js
const createJestConfig = nextJest({
  dir: './' // Path to your Next.js project
});

// Custom Jest configuration
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for jest-dom and other testing utilities
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Handle alias mapping for Next.js paths
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Mock CSS imports in tests
  },
  testEnvironment: 'jsdom', // Use jsdom environment for simulating browser-like behavior
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' // Use babel-jest to transform JS/TS files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|@supabase)' // Ensure certain modules are transpiled if needed
  ]
};

// Export Jest configuration
module.exports = createJestConfig(customJestConfig);
