require('dotenv').config()
let c = require('../constants')
const log = require('./log');

const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`
const BIDS_TABLE = 'bids'
const ASSETS_TABLE = 'assets'

const getNano = () => {
  if (!this.nano) this.nano = require('nano')(DB_URL)

  return this.nano
}

async function loadConfig() {
  try {
    const nano = getNano();
    const config = await nano.use('config')
    const global = await config.get('global')
    const collections = await config.get('collections')

    Object.keys(global).forEach(k => {
      c[k] = global[k]
    })

    c.collections = collections.collections
    log('Config loaded')
  } catch (e) {
    log(`DB loadConfig error: ${e}`)
  }
}

async function updateCollection(colId, assetId, bid) {
  try {
    const nano = getNano();
    const table = await nano.use(ASSETS_TABLE)
    const colData = await table.get(colId)

    for (const a of colData.assets) {
      if (a.id === assetId) {
        a.lastBidDate = new Date()
        a.lastBid = bid
        a.worker = process.env.ID
        a.account = process.env.ACCOUNT

        break
      }
    }

    await table.destroy(colData._id, colData._rev)
    await table.insert({
      lastClean: colData.lastClean,
      assets: colData.assets,
    }, colId)
  } catch (e) {
    log(`DB updateCollection error: ${e}`)
  }
}

async function getBids(colId, assetId) {
  try {
    const nano = getNano();
    const table = await nano.use(BIDS_TABLE)

    const docs = await table.find({
      selector: {
        collectionId: { $eq: colId },
        assetId: { $eq: assetId },
      }
    })

    return docs.docs
  } catch (e) {
    log(`DB getBids error: ${e}`)
  }
}

async function getAssets(colId) {
  try {
    const nano = getNano();
    const table = await nano.use(ASSETS_TABLE)
    const colData = await table.get(colId)

    colData.assets.forEach(a => {
      a.colId = colId
    })

    return colData.assets
  } catch (e) {
    log(`DB getAsset error: ${e}`)
  }
}

module.exports = {
  loadConfig,
  updateCollection,
  getBids,
  getAssets,
}