module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov', 'text', 'json-summary'],
  setupFiles: ['reflect-metadata'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@enums/(.*)$': '<rootDir>/src/enums/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'src/**/**/*.route.ts',
    'src/**/routes.ts',
    '!src/**/**/index.ts',
  ]
};
