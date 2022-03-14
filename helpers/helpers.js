module.exports = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  round: a => Math.round(a*100)/100,
  isBid: a => typeof a.lastBid === 'number' && a.lastBid > 0,
  shuffleArray: array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array
  }
}