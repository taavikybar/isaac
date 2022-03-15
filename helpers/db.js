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

async function getDb(dbName) {
  try {
    const nano = await getNano()
    const assets = await nano.use(dbName)
    const list = await assets.list()
    const allData = []

    for (const row of list.rows) {
      const assetData = await assets.get(row.id)
      allData.push(assetData)
    }

    return allData
  } catch (e) {
    log(`DB getDb error: ${e}`)
  }
}

async function updateTable(dbName, tableId, data) {
  try {
    const nano = await getNano()
    const table = await nano.use(dbName)
    const list = await table.list()
    const ids = list.rows.map(r => r.id)

    if (ids.includes(tableId)) {
      const tableData = await table.get(tableId)

      await table.destroy(tableData._id, tableData._rev)
    }

    await table.insert(data, tableId)
  } catch (e) {
    log(`DB updateTable error: ${e}`)
  }
}

async function deleteTable(dbName, tableId) {
  try {
    const nano = await getNano()
    const db = await nano.use(dbName)
    const list = await db.list()
    const ids = list.rows.map(r => r.id)

    if (ids.includes(tableId)) {
      const tableData = await db.get(tableId)

      await db.destroy(tableData._id, tableData._rev)
    }

    log(`Deleted ${tableId}`)
  } catch (e) {
    log(`DB deleteTable error: ${e}`)
  }
}

module.exports = {
  loadConfig,
  updateCollection,
  getAssets,
  getDb,
  updateTable,
  deleteTable,
}