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
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@local-types/(.*)$': '<rootDir>/src/types/$1',
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'src/**/router.ts',
    'src/**/routing.ts',
    '!src/**/**/index.ts',
  ]
};
