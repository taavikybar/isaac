const { performance } = require('perf_hooks');

module.exports = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  getDateKey: () => {
    const d = new Date()
    const year = `${d.getFullYear()}`.split('')
    return`${d.getDay()}-${d.getMonth()}-${year[2]}${year[3]}`
  },
  getTook: startTime => Math.round(performance.now() - startTime)/1000
}