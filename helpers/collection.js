
const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')
const log = require('./log')


// private
async function getCollection(colName) {
  const data = await fs.readFileSync(`./assets/${colName}.json`, 'utf8')
  return JSON.parse(data)
}

async function getCheckedCollection(colName) {
  const collection = await getCollection(colName)
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
const getUrl = (colName, id) => `${c.assetBaseUrl}/${getColById(colName).contract}/${id}`
const getColById = id => c.collections.find(col => col.id === id)

async function updateCollection(colName, id, bid) {
  const collection = await getCollection(colName)
  const index = collection.findIndex(a => a.id === id)

  collection[index].bids.push({
    date: new Date(),
    bid,
  })

  await fs.writeFileSync(`./assets/${colName}.json`, JSON.stringify(collection))
}

async function getAssets() {
  let assets = []
  const collections = c.collections.filter(c => c.worker === process.env.ID)

  for (col of collections) {
    const checked = await getCheckedCollection(col.id)
    checked.forEach(c => c.colName = col.id)
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