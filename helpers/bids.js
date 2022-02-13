const webdriver = require("selenium-webdriver");
const h = require('./helpers')
const c = require('../constants')
const co = require('./collection')
const By = webdriver.By

async function placeBid(driver, url, colName, id, bid) {
  const startTime = performance.now()
  let windows = await driver.getAllWindowHandles()
  await driver.switchTo().window(windows[0])
  await h.sleep(1000)

  // close any unnecessary windows
  try {
    windows = await driver.getAllWindowHandles()
    console.log(`window check: ${windows.length}w`)

    if (windows.length > 1) {
      await driver.switchTo().window(windows[1])
      await driver.close()
      await driver.switchTo().window(windows[0])
      console.log(`window check after closing: ${windows.length}w`)
    }
  } catch {
    console.log(`Initial window closing check error: ${a.id}`)
    return false
  }
  await h.sleep(1000)
  driver.navigate().to(url);
  await h.sleep(3000)

  // try if 404
  try {
    const is404 = await driver.findElement(By.xpath(`//h1[text()='${c.text404}']`))
    await driver.wait(webdriver.until.elementIsVisible(is404), 1000);
    await co.updateCollection(colName, id, c.update404)
    console.log(`${id}, took: ${h.getTook(startTime)}s, ${c.update404}`)
    return false
  } catch {

  }

  // check if offers present
  try {
    const noOffers = await driver.findElement(By.xpath(`//div[text()='${c.nOofferxTxt}']`))
    await driver.wait(webdriver.until.elementIsVisible(noOffers), 10000);
  } catch {
    await co.updateCollection(colName, id, c.bidPresent)
    console.log(`${id}, took: ${h.getTook(startTime)}s, ${c.bidPresent}`)
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
  await h.sleep(1000)
  const offerBtn2 = await driver.findElement(By.xpath(`//button[text()='${c.finalOfferButtonTxt}']`))
  await offerBtn2.click()

  // switch to metamask popup
  await h.sleep(5000)
  windows = await driver.getAllWindowHandles()
  try {
    if (windows.length > 1) {
      driver.switchTo().window(windows[1])
    }
  } catch {
    console.log(`Metamask window switch error: ${a.id}`)
    return false
  }
  await h.sleep(1000)

  // sign bid
  const signBtn = await driver.findElement(By.xpath(`//button[text()='${c.signButtonText}']`))
  await signBtn.click()
  await h.sleep(3000)

  // update collection, reporting
  await co.updateCollection(colName, id, bid)
  c.bidsMade++
  windows = await driver.getAllWindowHandles()
  console.log(`${id}, took: ${h.getTook(startTime)}s, bid set: ${bid}E, total: ${c.bidsMade} bids, ${windows.length}w`)
}

module.exports = {
  placeBid,
}