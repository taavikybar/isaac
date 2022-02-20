const webdriver = require("selenium-webdriver");
const By = webdriver.By
const NonFatalError = require('./NonFatalError')
const h = require('./helpers')
const c = require('../constants')
const co = require('./collection')
const db = require('./db')
const log = require('./log')
const d = require('./driver')

async function placeBid(driver, a) {
  const bid = co.getColById(a.colId).toBid
  const url = co.getUrl(a.colId, a.id)

  await d.switchToWindow(driver, 0)
  await d.closeOtherWindows(driver)

  await h.sleep(1000)
  await driver.navigate().to(url);
  await h.sleep(3000)

  // try if 404/504
  await d.findErrorElement(driver, a, c.text404, c.update404)
  await d.findErrorElement(driver, a, c.text504, c.update504)

  // check if offers present
  try {
    const noOffers = await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.nOofferxTxt}']`)), 1000);
  } catch {
    await db.updateCollection(a.colId, a.id, c.bidPresent)
    log.info(`${a.colId}-${a.id}, ${c.bidPresent}`)
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
  const offerBtn2 = await driver.findElement(By.xpath(`//button[text()='${c.finalOfferButtonTxt}']`))
  await offerBtn2.click()

  // switch to metamask popup
  await h.sleep(5000)
  await d.switchToWindow(driver, 1)

  // sign bid
  const signBtn = await driver.findElement(By.xpath(`//button[text()='${c.signButtonText}']`))
  await signBtn.click()
  await h.sleep(1000)

  // go back to main window
  await d.closeOtherWindows(driver)

  // update collection, reporting
  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${c.offerSubmitted}']`)),
      10000);

    await db.updateCollection(a.colId, a.id, bid)
    c.bidsMade++
    log.info(`${a.colId}-${a.id}, bid set: ${bid}E, total: ${c.bidsMade} bids`)
    return false
  } catch { }

  // no confirmation modal caught
  log.info(`${a.colId}-${a.id}, bid modal not caught, waiting ${c.minToWait}min`)
  await h.sleep(c.minToWait * 60 * 1000)
  throw new NonFatalError()
}

module.exports = {
  placeBid,
}