require('dotenv').config()
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const h = require('./helpers/helpers')
const c = require('./helpers/constants')
const s = require('./helpers/setup')
const b = require('./helpers/bids')
const co = require('./helpers/collection')


async function run() {
  const browser = await s.browserSetup()
  const metamask = await s.mmSetup(browser)
  const page = await s.pageSetup(browser)
  await s.connectWallet(page, metamask)

  // run collections
  await runCollection('cryptofighters', page, metamask)

  await browser.close();
}

async function runCollection(colName, page, metamask) {
  const collection = await co.getCollection(colName)
  const checked = collection.filter(co.isAssetValid)
  const colConfig = c.collections[colName]

  if (checked.length === 0) {
    console.log("nothing to bid on")
    return false
  }

  // run bidding on all checked assets
  for (a of checked) {
    const url = co.getUrl(colName, a.id)
    const bid = colConfig.toBid

    await b.placeBid(page, metamask, url, bid, colConfig.useBid, colName, a.id)
  }
}

run()