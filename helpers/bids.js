const webdriver = require("selenium-webdriver");
const h = require('./helpers')
const c = require('./constants')
const co = require('./collection')
const By = webdriver.By

async function placeBid(driver, url, colName, id, bid) {
  const startTime = performance.now()
  let windows = await driver.getAllWindowHandles()
  await h.sleep(1000)
  driver.switchTo().window(windows[1])
  await h.sleep(1000)
  driver.navigate().to(url);
  await h.sleep(3000)

  // check if offers present
  try {
    const noOffers = await driver.findElement(By.xpath("//div[text()='No offers yet']"))
    await driver.wait(webdriver.until.elementIsVisible(noOffers), 10000);
  } catch {
    await co.updateCollection(colName, id, c.bidPresent)
    console.log(`${id}, took: ${h.getTook(startTime)}s, ${c.bidPresent}`)
    return false
  }

  // open bid modal
  await h.sleep(2000)
  const offerBtn = await driver.findElement(By.xpath("//button[text()='Make offer']"))
  await offerBtn.click()

  // enter bid
  const offerInput = await driver.findElement(By.xpath("//input[@placeholder='Amount']"))
  await offerInput.sendKeys(bid)

  // submit bid
  await h.sleep(2000)
  const offerBtn2 = await driver.findElement(By.xpath("//button[text()='Make Offer']"))
  await offerBtn2.click()

  // switch to metamask popup
  await h.sleep(5000)
  windows = await driver.getAllWindowHandles()
  driver.switchTo().window(windows[2])
  await h.sleep(1000)

  // sign bid
  const signBtn = await driver.findElement(By.xpath("//button[text()='Sign']"))
  await signBtn.click()

  // update collection, reporting 
  await co.updateCollection(colName, id, bid)
  c.bidsMade++
  console.log(`${id}, took: ${h.getTook(startTime)}s, bid set: ${bid}E, total: ${c.bidsMade} bids`)
}

module.exports = {
  placeBid,
}