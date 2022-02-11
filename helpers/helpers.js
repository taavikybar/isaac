const { performance } = require('perf_hooks');

module.exports = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  getTook: startTime => Math.round(performance.now() - startTime)/1000
}