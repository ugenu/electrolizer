const jestDefault = require('./jest.config');

module.exports = {
  ...jestDefault,
  testMatch: ["**/main/?(*.)+(spec|test).[jt]s?(x)"],
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
};