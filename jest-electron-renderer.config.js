const jestDefault = require('./jest.config');

module.exports = {
  ...jestDefault,
  testMatch: ["**/renderer/?(*.)+(spec|test).[jt]s?(x)"],
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
};