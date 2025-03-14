// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  collectCoverage: false,
  setupFilesAfterEnv: ['./tests/setup.js'],
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '@server/(.*)': '<rootDir>/src/$1'
  },
  restoreMocks: false,
  rootDir: './',
  roots: ['<rootDir>/src', '<rootDir>/tests']
  // collectCoverageFrom: [
  //   '../**/*.js',
  //   '**/*.js',
  //   '!**/node_modules/**',
  //   '!**/coverage/**',
  //   '!**/tests/**',
  //   '!**/*.config.js'
  // ],
  // coverageDirectory: './coverage',
  // coverageReporters: ['json', 'html', 'text', 'lcov'],
}
