
const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')
const log = require('./log')
const db = require('./db')


// private
async function getCollection(colId) {
  const data = await fs.readFileSync(`./assets/${colId}.json`, 'utf8')
  return JSON.parse(data)
}

async function getCheckedCollection(colId) {
  const collection = await getCollection(colId)
  return collection.filter(isAssetValid)
}

const isAssetValid = asset => {
  if (asset.bids.length === 0) {
    return true
  }

  const MS_IN_H = 1000 * 60 * 60;
  const lastBid = asset.bids[asset.bids.length - 1].date
  const hoursSince = Math.floor((new Date() - new Date(lastBid)) / MS_IN_H)

  return hoursSince > c.bidDays * 24
}

// public
const getUrl = (colId, assetId) => `${c.assetBaseUrl}/${getColById(colId).contract}/${assetId}`
const getColById = id => c.collections.find(col => col.id === id)

async function updateCollection(colId, assetId, bid) {
  const collection = await getCollection(colId)
  const index = collection.findIndex(a => a.id === assetId)

  collection[index].bids.push({
    date: new Date(),
    bid,
  })

  const data = {
    date: new Date(),
    collectionId: a.colId,
    assetId: a.id,
    bid,
    worker: process.env.ID,
  }
  
  db.addBid(data)

  await fs.writeFileSync(`./assets/${colId}.json`, JSON.stringify(collection))
}

async function getAssets() {
  let assets = []
  const collections = c.collections.filter(c => c.worker === process.env.ID)

  for (col of collections) {
    const checked = await getCheckedCollection(col.id)
    checked.forEach(a => a.colId = col.id)
    assets = [...assets, ...checked]
  }

  return assets
}

module.exports = {
  getUrl,
  updateCollection,
  getAssets,
  getColById,
}