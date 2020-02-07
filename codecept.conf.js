// noinspection JSUnresolvedVariable
exports.config = {
  bootstrap: false,
  output: './e2e/output',
  helpers: {
    // puppeteer config
    Puppeteer: {
      url: 'https://outlook.office.com/owa/?path=/mail/inbox',
      show: true,
      windowSize: '1024x768',
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true
    }
  },
  include: {
    loginToOwaPage: './e2e/pages/loginToOwa.js',
    addinPage: './e2e/pages/addIn.js'
  },
  mocha: {},
  require: [],
  teardown: null,
  hooks: [],
  gherkin: {},
  plugins: {
    screenshotOnFail: { enabled: true }
  },
  tests: './e2e/tests/*_test.js',
  timeout: 5000,
  name: 'owa-one'
};
