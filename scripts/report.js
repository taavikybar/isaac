const fs = require('fs');
const c = require('../constants')
const h = require('../helpers/helpers')

const MS_IN_H = 1000 * 60 * 60
let html = '<html><head><link href="styles.css" rel="stylesheet" type="text/css"></head><body><table><tr><th>Collection</th><th>Active bids</th><th>Expired bids</th><th>Total tried</th><th>Assets</th><th>To bid</th><th>Amount bid</th><th>Earliest bid</th><th>h since</th><th>Latest bid</th><th>h since</th></tr>'
const BID_H = c.bidDays * 24

const add = h => {
  html = `${html}${h}`
}

const tt = {
  total: 0,
  expired: 0,
  assets: 0,
  toBid: 0,
  active: 0,
  amount: 0,
}

async function report() {
  await Object.keys(c.collections).forEach(async colName => {
    const file = await fs.readFileSync(`./assets/${colName}.json`, 'utf8')
    const assets = JSON.parse(file)
    const now = new Date()
    const t = {
      total: 0,
      expired: 0,
      active: 0,
      toBid: 0,
      amount: 0,
      earliestBid: undefined,
      latestBid: undefined,
    }

    assets.forEach(asset => {
      if (!asset.bids || asset.bids.length === 0) return false
      const bid = asset.bids[asset.bids.length - 1]

      t.total++

      if (typeof bid.bid === 'number') {
        const diff = Math.floor((now - new Date(bid.date)) / MS_IN_H)

        if (diff <= BID_H) {
          t.active++
          t.amount = t.amount + h.round(bid.bid)*1000
        }
        else t.expired++

        if (!t.earliestBid) t.earliestBid = bid.date
        if (bid.date < t.earliestBid) t.earliestBid = bid.date
        if (!t.latestBid) t.latestBid = bid.date
        if (bid.date > t.latestBid) t.latestBid = bid.date
      }
    })

    t.amount = t.amount/1000
    t.toBid = assets.length - t.total + t.expired

    tt.expired = tt.expired + t.expired
    tt.active = tt.active + t.active
    tt.total = tt.total + t.total
    tt.assets = tt.assets + assets.length
    tt.toBid = tt.toBid + t.toBid
    tt.amount = tt.amount + t.amount

    const diff1 = Math.floor((now - new Date(t.earliestBid)) / MS_IN_H)
    const diff2 = Math.floor((now - new Date(t.latestBid)) / MS_IN_H)

    add(`<tr><td>${colName}</td><td>${t.active}</td><td>${t.expired}</td><td>${t.total}</td><td>${assets.length}</td><td>${t.toBid}</td><td>${t.amount}E</td><td>${t.earliestBid}</td><td class="${diff1 > BID_H ? 'green' : 'red'}">${diff1}</td><td>${t.latestBid}</td><td class="${diff2 > BID_H ? 'green' : 'red'}">${diff2}</td></tr>`)
  })

  add(`<tr><td>Totals</td><td>${tt.active}</td><td>${tt.expired}</td><td>${tt.total}</td><td>${tt.assets}</td><td>${tt.toBid}</td><td>${h.round(tt.amount)}E</td><td></td><td></td><td></td><td></td></tr>`)

  add(`<tr><td>-</td><td>-</td></tr><tr><td>Max bid amount</td><td>${h.round(c.limitInEth*c.ethInWallet)}E</td></tr><tr><td>Amount left</td><td>${h.round(c.limitInEth*c.ethInWallet-tt.amount)}E</td></tr>`)

  add(`</table></body></html>`)
  await fs.writeFileSync(`./reports/index.html`, html)
}


report()