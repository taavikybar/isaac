require('dotenv').config()
let c = require('../constants')
const log = require('./log');
const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`
const BIDS_TABLE = 'bids'
const ASSETS_TABLE = 'assets'

async function loadConfig() {
  try {
    const nano = require('nano')(DB_URL);
    const config = await nano.use('config')
    const global = await config.get('global')
    const collections = await config.get('collections')

    Object.keys(global).forEach(k => {
      c[k] = global[k]
    })

    c.collections = collections.collections
    log.info('Config loaded')
  } catch (e) {
    log.info(`DB loadConfig error: ${e}`)
  }
}

async function addBid(data) {
  try {
    const nano = require('nano')(DB_URL);
    const table = await nano.use(BIDS_TABLE)

    await table.insert(data)
  } catch (e) {
    log.info(`DB addBid error: ${e}`)
  }
}

async function getBids(colId, assetId) {
  try {
    const nano = require('nano')(DB_URL);
    const table = await nano.use(BIDS_TABLE)

    const docs = await table.find({
      selector: {
        collectionId: { $eq: colId },
        assetId: { $eq: assetId },
      }
    })

    return docs.docs
  } catch (e) {
    log.info(`DB getBids error: ${e}`)
  }
}

async function getAssets(colId) {
  try {
    const nano = require('nano')(DB_URL);
    const table = await nano.use(ASSETS_TABLE)
    const ids = await table.get(colId)

    return ids.ids.map(id => {
      return {
        id,
        colId,
      }
    })
  } catch (e) {
    log.info(`DB getAsset error: ${e}`)
  }
}


module.exports = {
  loadConfig,
  addBid,
  getBids,
  getAssets,
}