
const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')

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

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const lastBid = asset.bids[asset.bids.length - 1].date
  const lastBidDate = new Date(lastBid)
  const now = new Date()
  const daysSince = Math.floor((now - lastBidDate)/MS_PER_DAY)

  return daysSince > c.bidDays
}

const getUrl = (colName, id) => `${c.assetBaseUrl}/${c.collections[colName].contract}/${id}`

async function updateCollection(colName, id, bid) {
  const collection = await getCollection(colName)
  const index = collection.findIndex(a => a.id === id)

  collection[index].bids.push({
    date: new Date(),
    bid,
  })

  await fs.writeFileSync(`./assets/${colName}.json`, JSON.stringify(collection))
}

module.exports = {
  getCheckedCollection,
  isAssetValid,
  getUrl,
  updateCollection,
}