require('dotenv').config()
const { performance } = require('perf_hooks');

const h = require('./helpers/helpers')
const c = require('./constants')
const b = require('./helpers/bids')
const co = require('./helpers/collection')
const s = require('./helpers/setup')
const log = require('./helpers/log')


async function run() {
  // check all collections
  const collection = await co.getCheckedCollection(c.collectionToRun)
  if (collection.length === 0) {
    log("nothing to bid on")
    return false
  }

  // setup
  const startTime = performance.now()
  const driver = await s.setup()
  log(`Setup took ${h.getTook(startTime)}s`)

  // run collections
  await runCollection(driver, c.collectionToRun)
}

async function runCollection(driver, colName) {
  const startTime = performance.now()
  const checked = await co.getCheckedCollection(colName)
  const colConfig = c.collections[colName]

  // run bidding on all checked assets
  for (a of checked) {
    const url = co.getUrl(colName, a.id)
    const bid = colConfig.toBid

    try {
      await b.placeBid(driver, url, colName, a.id, bid)
    } catch (e) {
      log(`Error: ${a.id}, ${e}`)
      await co.updateCollection(colName, a.id, 'error')
    }
  }

  log(`${colName} collection took ${h.getTook(startTime)}s`)
}

run()