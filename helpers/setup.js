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
      // product: 'firefox',
      // slowMo: 100,
      // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      // args: ['--disable-popup-blocking','--allow-popups-during-page-unload']
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