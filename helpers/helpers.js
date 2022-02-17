const { performance } = require('perf_hooks');

module.exports = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  getTook: startTime => Math.round(performance.now() - startTime) / 1000,
  round: a => Math.round(a*100)/100,
  shuffleArray: array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array
  }
}