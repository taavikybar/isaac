
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

  const MS_IN_H = 1000 * 60 * 60;
  const lastBid = asset.bids[asset.bids.length - 1].date
  const hoursSince = Math.floor((new Date() - new Date(lastBid)) / MS_IN_H)

  return hoursSince > c.bidDays * 24
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