require('dotenv').config()
let c = require('../constants')
const log = require('./log');
const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`

async function loadConfig() {
  try {
    const nano = require('nano')(DB_URL);
    const config = await nano.use('config')
    const global = await config.get('global')
    const assets = await config.get('assets')

    Object.keys(global).forEach(k => {
      c[k] = global[k]
    })

    c.collections = assets.collections
    log.info('Config loaded')
  } catch (e) {
    log.info(`DB config load error: ${e}`)
  }
}

async function addBid(data) {
  try {
    const nano = require('nano')(DB_URL);
    const table = await nano.use('bids')

    await table.insert(data)
  } catch (e) {
    log.info(`DB bid add error: ${e}`)
  }
}

async function getAsset(colId, assetId) {

}

module.exports = {
  loadConfig,
  addBid,
  getAsset,
}