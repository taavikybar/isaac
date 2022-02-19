const webdriver = require("selenium-webdriver");
const h = require('./helpers')
const c = require('../constants')
const co = require('./collection')
const log = require('./log')
const By = webdriver.By

async function placeBid(driver, a) {
  const startTime = performance.now()
  const bid = c.collections[a.colName].toBid
  const url = co.getUrl(a.colName, a.id)
  let windows = await driver.getAllWindowHandles()
  
  await driver.switchTo().window(windows[0])
  await h.sleep(1000)

  // close any unnecessary windows
  try {
    windows = await driver.getAllWindowHandles()
    log(`window check: ${windows.length}w`)

    if (windows.length > 1) {
      await driver.switchTo().window(windows[1])
      await driver.close()
      await driver.switchTo().window(windows[0])
      log(`window check after closing: ${windows.length}w`)
    }
  } catch {
    log(`Initial window closing check error: ${a.id}`)
    return false
  }
  await h.sleep(1000)
  driver.navigate().to(url);
  await h.sleep(3000)

  // try if 404
  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.text404}']`)),
      1000);

    await co.updateCollection(a.colName, a.id, c.update404)
    log(`${a.colName}-${a.id}, took: ${h.getTook(startTime)}s, ${c.update404}`)
    return false
  } catch { }

  // try if 504
  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.text504}']`)),
      1000);

    await co.updateCollection(a.colName, a.id, c.update404)
    log(`${a.id}, took: ${h.getTook(startTime)}s, ${c.update504}`)
    return false
  } catch { }

  // check if offers present
  try {
    const noOffers = await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.nOofferxTxt}']`)), 1000);
  } catch {
    await co.updateCollection(a.colName, a.id, c.bidPresent)
    log(`${a.colName}-${a.id}, took: ${h.getTook(startTime)}s, ${c.bidPresent}`)
    return false
  }

  // open bid modal
  await h.sleep(1000)
  const offerBtn = await driver.findElement(By.xpath(`//button[text()='${c.offerButtonTxt}']`))
  await offerBtn.click()

  // enter bid
  const offerInput = await driver.findElement(By.xpath(`//input[@placeholder='${c.inputPlaceholder}']`))
  await offerInput.sendKeys(bid)

  // submit bid
  // await h.sleep(1000)
  const offerBtn2 = await driver.findElement(By.xpath(`//button[text()='${c.finalOfferButtonTxt}']`))
  await offerBtn2.click()

  // switch to metamask popup
  await h.sleep(5000)
  windows = await driver.getAllWindowHandles()

  if (windows.length > 1) {
    driver.switchTo().window(windows[1])
  }

  await h.sleep(1000)

  // sign bid
  const signBtn = await driver.findElement(By.xpath(`//button[text()='${c.signButtonText}']`))
  await signBtn.click()
  // await h.sleep(3000)

  // go back to main window
  windows = await driver.getAllWindowHandles()
  await driver.switchTo().window(windows[0])

  // update collection, reporting
  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.offerSubmitted}']`)),
      10000);

    await co.updateCollection(a.colName, a.id, bid)
    c.bidsMade++
    windows = await driver.getAllWindowHandles()
    log(`${a.colName}-${a.id}, took: ${h.getTook(startTime)}s, bid set: ${bid}E, total: ${c.bidsMade} bids, ${windows.length}w`)
    return false
  } catch { }

  // no confirmation modal caught
  log(`${a.colName}-${a.id}, bid modal not caught, waiting ${c.minToWait}min`)
  await h.sleep(c.minToWait*60*1000)
  throw new Error()
}

module.exports = {
  placeBid,
}