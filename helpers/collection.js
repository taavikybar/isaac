const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')
const log = require('./log')
const db = require('./db')


// private
async function isAssetValid(a) {
  return true
  log.info(`Checking ${a.colId}-${a.id}`)
  const bids = await db.getBids(a.colId, a.id)

  if (bids.length === 0) {
    return true
  }

  const MS_IN_H = 1000 * 60 * 60;
  const lastBid = bids[bids.length - 1].date
  const hoursSince = Math.floor((new Date() - new Date(lastBid)) / MS_IN_H)

  return hoursSince > c.bidDays * 24
}

// public
const getUrl = (colId, assetId) => `${c.assetBaseUrl}/${getColById(colId).contract}/${assetId}`

const getColById = id => c.collections.find(col => col.id === id)

async function getAssets() {
  let assets = []
  const collections = c.collections.filter(c => c.worker === process.env.ID)

  for (col of collections) {
    const allAssets = await db.getAssets(col.id)
    const checked = []

    for (a of allAssets) {
      if (await isAssetValid(a)) {
        checked.push(a)
      }
    }

    assets = [...assets, ...checked]
  }

  return assets
}

module.exports = {
  getUrl,
  getAssets,
  getColById,
}