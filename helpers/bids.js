const webdriver = require("selenium-webdriver")
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
  await driver.navigate().to(url)
  await h.sleep(1000)

  // try if 404/504 or owned by NullAddress
  await d.findErrorElement(driver, a, c.text404, c.update404)
  await d.findErrorElement(driver, a, c.text504, c.update504)
  await d.findErrorElement(driver, a, c.reportedText, c.reported)
  await d.findNullOwnerElement(driver, a)

  // check if offers present
  if (c.checkForOtherOffers) {
    try {
      const noOffers = await driver.wait(
        webdriver.until.elementLocated(By.xpath(`//*[text()='${c.nOofferxTxt}']`)), 1000)
    } catch {
      await db.updateCollection(a.colId, a.id, c.bidPresent)
      log(`${a.colId}-${a.id}, ${c.bidPresent}`)
      return false
    }
  }

  // click Make Offer button and open bid modal
  const offerBtn = await driver.findElement(By.xpath(`//button[text()='${c.offerButtonTxt}']`))
  await offerBtn.click()

  // look for Accept Terms button first time
  try {
    const agreeTerms = await driver.wait(webdriver.until.elementLocated(By.xpath(`//input[@id='review-confirmation']`)), 1000)
    await agreeTerms.click()
  } catch { }

  // check if Welcome to OS modal has appeared
  try {
    const windows = await driver.getAllWindowHandles()

    if (windows.length > 1) {
      await d.switchToWindow(driver, 1)

      await driver.wait(webdriver.until.elementLocated(
        By.xpath(`//*[contains(text(),'${c.welcomeToOSText}')]`)), 1000)

      const signBtn = await driver.findElement(By.xpath(`//button[text()='${c.signButtonText}']`))
      await signBtn.click()
      await d.switchToWindow(driver, 0)
    }
  } catch { }

  // look for Accept Terms button second time
  try {
    const agreeTerms = await driver.wait(webdriver.until.elementLocated(By.xpath(`//input[@id='review-confirmation']`)), 1000)
    await agreeTerms.click()
  } catch { }

  // enter bid
  const offerInput = await driver.findElement(By.xpath(`//input[@placeholder='${c.inputPlaceholder}']`))
  await offerInput.sendKeys(bid)

  // submit bid
  const offerBtn2 = await driver.findElement(By.xpath(`//button[text()='${c.finalOfferButtonTxt}']`))
  await offerBtn2.click()

  // switch to metamask popup
  await h.sleep(7000)
  await d.switchToWindow(driver, 1)

  // check if permissions to access modal has appeared
  try {
    await driver.wait(webdriver.until.elementLocated(
      By.xpath(`//*[contains(text(),'${c.permissionModalText}')]`)), 1000)

    const rejectBtn = await driver.findElement(
      By.xpath(`//button[text()='${c.rejectButtonText}']`))

    await rejectBtn.click()
    await d.switchToWindow(driver, 1)
  } catch { }

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
      10000)

    await db.updateCollection(a.colId, a.id, bid)
    c.bidsMade++
    log(`${a.colId}-${a.id}, bid set: ${bid}E, total: ${c.bidsMade} bids`)
    return false
  } catch { }

  // no confirmation modal caught
  log(`${a.colId}-${a.id}, bid modal not caught, waiting ${c.minToWait}min`)
  await h.sleep(c.minToWait * 60 * 1000)
  throw new NonFatalError()
}

module.exports = {
  placeBid,
}