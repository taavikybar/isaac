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
  const driver = await s.setup()
  let fatal = false

  try {
    await s.unlockMetamask(driver)
  } catch (e) {
    log(`Unlock metamask error: ${e}`)
    fatal = true
  }

  if (fatal) {
    await driver.quit()
    run()
  } else {
    log(`Setup took ${h.getTook(startTime)}s`)
    runAssets(driver)
  }
}

async function runAssets(driver) {
  await db.loadConfig()
  let assets = await co.getAssets()
  let fatal = false
  let assetsRun = 0

  assets = h.shuffleArray(assets)

  if (assets.length === 0) {
    log('No assets to run')
    await driver.quit()
    return false
  }

  log(`Running all ${assets.length} assets`)

  for (a of assets) {
    try {
      await b.placeBid(driver, a)
      assetsRun++

      if (assetsRun === c.assetsToRunBeforeUpdate) {
        throw new NonFatalError('Reloading config')
      }
    } catch (e) {
      if (e instanceof NonFatalError) {
        log(`Non-fatal error ${a.colId}-${a.id}, ${e}`)
      } else {
        log(`Fatal error, ${e}`)
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