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
    '^@common/(.*)$': '<rootDir>/src/server/common/$1',
    '^@enums/(.*)$': '<rootDir>/src/server/enums/$1',
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'src/core/use-cases/**/*.use-case.ts',
    'src/server/**/**/*.route.ts',
    'src/server/**/routes.ts',
    '!src/use-cases/**/index.ts',
  ]
};
