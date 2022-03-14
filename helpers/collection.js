const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')
const log = require('./log')
const db = require('./db')

const MS_IN_H = 1000 * 60 * 60
const H_IN_DAY = 24

// private
async function isAssetValid(a) {
  if (a.lastBidDate === null) {
    return true
  }

  const hoursSince = Math.floor(
    (new Date() - new Date(a.lastBidDate))
    / MS_IN_H
  )

  if (h.isBid(a)) {
    return hoursSince > c.bidDays * H_IN_DAY
  }

  return hoursSince > c.otherRetryDays * H_IN_DAY
}

// public
const getUrl = (colId, assetId) => `${c.assetBaseUrl}/${getColById(colId).contract}/${assetId}`

const getColById = id => c.collections.find(col => col.id === id)

async function getAssets() {
  let assets = []
  
  const colIds = c.collections
    .filter(c => c.worker === process.env.ID)
    .map(c => c.id)

  log(`Running on collections: ${colIds}`)

  for (colId of colIds) {
    const allAssets = await db.getAssets(colId)
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