require('dotenv').config()
const { performance } = require('perf_hooks');
const h = require('./helpers/helpers')
const c = require('./constants')
const b = require('./helpers/bids')
const co = require('./helpers/collection')
const s = require('./helpers/setup')
const log = require('./helpers/log');
const db = require('./helpers/db');
const { Driver } = require('selenium-webdriver/chrome');
const NonFatalError = require('./helpers/NonFatalError')


async function run() {
  const startTime = performance.now()
  await db.loadConfig()
  const driver = await s.setup()
  
  log.info(`Setup took ${h.getTook(startTime)}s`)

  runAssets(driver)
}

async function runAssets(driver) {
  let assets = await co.getAssets()
  let fatal = false
  
  assets = h.shuffleArray(assets)
  log.info(`Running all ${assets.length} assets`)

  for (a of assets) {
    try {
      await b.placeBid(driver, a)
    } catch (e) {
      if (e instanceof NonFatalError) {
        log.info(`Non-fatal error ${a.colId}-${a.id}, ${e}`)
      } else {
        log.info(`Fatal error, ${e}`)
        fatal = true
      }

      break
    }
  }

  if (fatal) {
    await driver.quit()
    run()
  } else {
    runAssets(driver)
  }
}

run()