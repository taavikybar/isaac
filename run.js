require('dotenv').config()
const { performance } = require('perf_hooks');
const h = require('./helpers/helpers')
const c = require('./constants')
const b = require('./helpers/bids')
const co = require('./helpers/collection')
const s = require('./helpers/setup')
const log = require('./helpers/log');
const db = require('./helpers/db');
const balancer = require('./helpers/balancer');
const { Driver } = require('selenium-webdriver/chrome');
const NonFatalError = require('./helpers/NonFatalError')


async function run() {
  await db.loadConfig()
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
    log(`Setup finished`)
    runAssets(driver)
  }
}

async function runAssets(driver) {
  await db.loadConfig()
  let assets = await balancer.getLoad()
  let fatal = false
  let assetsRun = 0

  assets = h.shuffleArray(assets)

  if (assets.length === 0) {
    log(`No assets to run, waiting ${c.minToWait}min`)
    await h.sleep(c.minToWait * 60 * 1000)
  }

  for (const a of assets) {
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