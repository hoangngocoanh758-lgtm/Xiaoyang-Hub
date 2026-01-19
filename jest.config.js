module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!src/main.js', '!src/assets/**'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
