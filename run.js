require('dotenv').config()
const { performance } = require('perf_hooks');
const h = require('./helpers/helpers')
const c = require('./helpers/constants')
const b = require('./helpers/bids')
const co = require('./helpers/collection')
const se = require('./helpers/selenium')


async function run() {
  // check all collections
  const collection = await co.getCheckedCollection('cryptofighters')
  if (collection.length === 0) {
    console.log("nothing to bid on")
    return false
  }

  // setup
  const startTime = performance.now()
  const driver = await se.setup()
  console.log(`Setup took ${h.getTook(startTime)}s`)

  // run collections
  await runCollection(driver, 'cryptofighters')
}

async function runCollection(driver, colName) {
  const startTime = performance.now()
  const checked = await co.getCheckedCollection(colName)
  const colConfig = c.collections[colName]

  // run bidding on all checked assets
  for (a of checked) {
    const url = co.getUrl(colName, a.id)
    const bid = colConfig.toBid

    await b.placeBid(driver, url, colName, a.id, bid)
  }

  console.log(`${colName} collection took ${h.getTook(startTime)}s`)
}

run()