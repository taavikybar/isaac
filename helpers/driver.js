const webdriver = require("selenium-webdriver");
const co = require('./collection')
const log = require('./log')
const h = require('./helpers')
const By = webdriver.By

async function findErrorElement(driver, a, text, updateText) {
  let found = false

  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${text}']`)),
      1000);

    await co.updateCollection(a.colName, a.id, updateText)
    found = true
  } catch { }

  if (found) {
    throw new Error(updateText)
  }
}

async function closeOtherWindows(driver) {
  let windows = await driver.getAllWindowHandles()
  const beforeCount = windows.length

  if (windows.length > 1) {
    for (w of windows) {
      await driver.switchTo().window(w)
      await driver.close()
    }
  }

  switchToWindow(driver, 0)
  windows = await driver.getAllWindowHandles()

  log(`Close windows: ${beforeCount}->${windows.length}`)
}

async function switchToWindow(driver, index) {
  let windows = await driver.getAllWindowHandles()

  if (windows.length > index) {
    driver.switchTo().window(windows[index])
  }

  await h.sleep(1000)
}

module.exports = {
  findErrorElement,
  closeOtherWindows,
  switchToWindow,
}