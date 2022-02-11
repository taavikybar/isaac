const h = require('./helpers')
const c = require('./constants')
const co = require('./collection')

async function placeBid(page, metamask, url, bid, useBid, colName, id) {
  await page.goto(url);
  page.bringToFront();
  await h.sleep(2000)
  let btnTxt = c.offerButtonTxt

  if (useBid) {
    btnTxt = c.bidButtonTxt
  }

  const [noOffers] = await page.$x(`//div[contains(text(), '${c.nOofferxTxt}')]`);

  if (!noOffers) {
    await noteBid(colName, id, c.bidPresent)
    console.log(`${id}, ${url}, ${c.bidPresent}`)
    return
  }

  // click make offer button
  await h.sleep(1000)
  const [button] = await page.$x(`//button[contains(., '${btnTxt}')]`);
  await button.click();

  // set bid
  await h.sleep(1000)
  const parts = `${bid}`.split('')

  for await (const part of parts) {
    await page.keyboard.type(part);
    await h.sleep(1000)
  }


  // await metamask.confirmTransaction();

  // bid is set
  await noteBid(colName, id, bid)
  console.log(`${id}, ${url}, bid set: ${bid}E`)
}

async function noteBid(colName, id, bid) {
  const collection = await co.getCollection(colName)
  const index = collection.findIndex(a => a.id === id)

  collection[index].bids[getDateKey()] = bid

  await fs.writeFileSync(`${assetsPath}/${colName}.json`, JSON.stringify(collection))
}

module.exports = {
  placeBid,
}