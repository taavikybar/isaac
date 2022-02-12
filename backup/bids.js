const fs = require('fs');
const { performance } = require('perf_hooks');
const h = require('./helpers')
const c = require('../constants')
const co = require('./collection')

async function placeBid(page, metamask, url, bid, useBid, colName, id) {
  const startTime = performance.now()
  await page.goto(url);
  page.bringToFront();
  await h.sleep(1000)

  let btnTxt = c.offerButtonTxt

  if (useBid) {
    btnTxt = c.bidButtonTxt
  }

  // if 404
  const [text404] = await page.$x(`//h1[contains(text(), '${c.text404}')]`);

  if (text404) {
    await co.updateCollection(colName, id, c.update404)
    console.log(`${id}, took: ${h.getTook(startTime)}s, ${c.update404}`)
    return
  }

  // if offers present
  const [noOffers] = await page.$x(`//div[contains(text(), '${c.nOofferxTxt}')]`);

  if (!noOffers) {
    await co.updateCollection(colName, id, c.bidPresent)
    console.log(`${id}, took: ${h.getTook(startTime)}s, ${c.bidPresent}`)
    return
  }

  // click make offer button
  await h.sleep(500)
  const [button] = await page.$x(`//button[contains(., '${btnTxt}')]`);
  await button.click();

  // set bid amount
  await h.sleep(500)
  const parts = `${bid}`.split('')

  for await (const part of parts) {
    await page.keyboard.type(part);
    await h.sleep(100)
  }

  // check agree terms
  // const tos = await page.waitForSelector('input#tos')
  // tos.click()

  // make offer
  await h.sleep(500)
  // await h.sleep(30000)
  // const offerBtn = await page.$('.fzwDgL')
  const offerBtn = await page.$x(`//button[contains(., 'Make Offer')]`);
  await offerBtn[0].click();
  // console.log(offerBtn)
  // console.log(offerBtn.length)
  await h.sleep(5000)

  // await metamask.confirmTransaction();
  // await metamask.approve({allAccounts: false});
  // await metamask.sign();
  await h.sleep(5000000)

  // bid is set
  await co.updateCollection(colName, id, bid)
  c.bidsMade++
  console.log(`${id}, took: ${h.getTook(startTime)}s, bid set: ${bid}E, total: ${c.bidsMade} bids`)
}

module.exports = {
  placeBid,
}