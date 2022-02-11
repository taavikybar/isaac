const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const h = require('./helpers')
const c = require('./constants')

async function browserSetup() {
  return await dappeteer.launch(
    puppeteer,
    {
      metamaskVersion: 'v10.8.1',
      defaultViewport: null,
      headless: false,
      // slowMo: 100
    }
  )
}

async function mmSetup(browser) {
  return await dappeteer.setupMetamask(
    browser,
    {
      seed: process.env.SEED,
    }
  )
}

async function pageSetup(browser) {
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 1200,
  })

  return page
}

async function connectWallet(page, metamask) {
  await page.goto(c.loginUrl);
  await h.sleep(1000)
  const btn = await page.$x('//span[contains(text(),"MetaMask")]');
  await btn[0].click();
  await metamask.approve({ allAccounts: false });
  await h.sleep(1000)
}


module.exports = {
  browserSetup,
  mmSetup,
  pageSetup,
  connectWallet,
}