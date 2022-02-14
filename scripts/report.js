const fs = require('fs');
const c = require('../constants')

const MS_IN_H = 1000 * 60 * 60
let html = '<html><head><link href="styles.css" rel="stylesheet" type="text/css"></head><body><table><tr><th>Collection</th><th>Bids made</th><th>Bids present</th><th>Is 404</th><th>Total</th><th>Assets</th><th>To bid</th><th>Earliest bid</th><th>h since</th><th>Latest bid</th><th>h since</th></tr>'

const add = h => {
  html = `${html}${h}`
}

const tt = {
  total: 0,
  bids: 0,
  present: 0,
  is404: 0,
  assets: 0,
  toBid: 0,
}

async function report() {
  await Object.keys(c.collections).forEach(async colName => {
    const file = await fs.readFileSync(`./assets/${colName}.json`, 'utf8')
    const assets = JSON.parse(file)
    const now = new Date()
    const t = {
      total: 0,
      bids: 0,
      present: 0,
      is404: 0,
      toBid: 0,
      earliestBid: undefined,
      latestBid: undefined,
    }

    assets.forEach(asset => {
      if (!asset.bids || asset.bids.length === 0) return false
      const bid = asset.bids[asset.bids.length - 1]

      if (bid.bid === c.bidPresent) t.present++
      else if (bid.bid === c.update404) t.is404++
      else t.bids++
      t.total++

      if (!t.earliestBid) t.earliestBid = bid.date
      if (bid.date < t.earliestBid)t.earliestBid = bid.date
      if (!t.latestBid) t.latestBid = bid.date
      if (bid.date > t.latestBid)t.latestBid = bid.date
    })

    t.toBid = assets.length - t.total
    tt.bids = tt.bids + t.bids
    tt.present = tt.present + t.present
    tt.is404 = tt.is404 + t.is404
    tt.total = tt.total + t.total
    tt.assets = tt.assets + assets.length
    tt.toBid = tt.toBid + t.toBid

    const diff1 = Math.floor((now - new Date(t.earliestBid))/MS_IN_H)
    const diff2 = Math.floor((now - new Date(t.latestBid))/MS_IN_H)

    add(`<tr><td>${colName}</td><td>${t.bids}</td><td>${t.present}</td><td>${t.is404}</td><td>${t.total}</td><td>${assets.length}</td><td>${t.toBid}</td><td>${t.earliestBid}</td><td class="${diff1>72?'green':'red'}">${diff1}</td><td>${t.latestBid}</td><td class="${diff2>72?'green':'red'}">${diff2}</td></tr>`)
  })

  add(`<tr><td></td><td>${tt.bids}</td><td>${tt.present}</td><td>${tt.is404}</td><td>${tt.total}</td><td>${tt.assets}</td><td>${tt.toBid}</td><td></td><td></td><td></td><td></td></tr>`)

  add(`</table></body></html>`)
  await fs.writeFileSync(`./reports/index.html`, html)
}


report()