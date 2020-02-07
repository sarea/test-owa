process.env.CHROME_BIN = require('puppeteer').executablePath();

// Karma configuration file, see link for more information
// https://karma-runner.github.io/2.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
      'src/global-mocks.js'
    ],
    exclude: [
      'src/lib/logMessage.ts'
    ],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-mocha-reporter'),
      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },


    reporters: ['mocha', 'kjhtml', 'junit'], // 'spec', 'progress',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      // 'Chrome',
      'ChromeHeadless'
    ],
    singleRun: true,

    // the default configuration
		junitReporter: {
			outputDir: 'tmp', // results will be saved as $outputDir/$browserName.xml
			outputFile: 'karma-results.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
			suite: 'OWA', // suite will become the package name attribute in xml testsuite element
			useBrowserName: true, // add browser name to report and classes names
			nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
			classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
			properties: {}, // key value pair of properties to add to the <properties> section of the report
			xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
		},

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ]
      }
    },
  });
};
