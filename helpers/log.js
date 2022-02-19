const opts = {
  errorEventName: 'error',
  logDirectory: './logs',
  fileNamePattern: 'log-<DATE>.log',
  dateFormat: 'DD.MM.YY'
};

const logFile = require('simple-node-logger').createRollingFileLogger(opts);
const logConsole = require('simple-node-logger').createSimpleLogger();

module.exports = {
  info: text => {
    logFile.info(text)
    logConsole.info(text)
  },
  error: text => {
    try {
      logFile.error(text)
      logConsole.error(text)
    } catch { }
  }
}