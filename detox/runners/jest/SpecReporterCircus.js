const CircusTestEventListenerBase = require('./CircusTestEventListenerBase');
const SpecReporter = require('./SpecReporterImpl');

class SpecReporterCircus extends CircusTestEventListenerBase {
  constructor() {
    super();
    this._specReporter = new SpecReporter();
  }

  _onSuiteStart(event) {
    if (event.describeBlock.parent !== undefined) {
      this._specReporter.onSuiteStart({
        description: event.describeBlock.name,
      });
    }
  }

  _onSuiteEnd(event) {
    if (event.describeBlock.parent !== undefined) {
      this._specReporter.onSuiteEnd();
    }
  }

  _onTestStart(event) {
    this._specReporter.onTestStart({
      description: event.test.name,
    });
  }

  _onTestComplete(event) {
    const { test } = event;
    const testInfo = {
      description: test.name,
    };
    if(test.errors.length){
      this._specReporter.onTestEnd(testInfo, "failed");
    }
    else if(test.invocations && test.invocations > 1) {
      this._specReporter.onTestEnd(testInfo, "retry");
    }else {
      this._specReporter.onTestEnd(testInfo, 'success');
    }
  }

  _onTestSkip(event) {
    const testInfo = {
      description: event.test.name,
    };
    this._specReporter.onTestEnd(testInfo, 'skipped');
  }
}

module.exports = SpecReporterCircus;
