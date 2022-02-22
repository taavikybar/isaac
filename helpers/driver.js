const webdriver = require("selenium-webdriver");
const co = require('./collection')
const log = require('./log')
const h = require('./helpers')
const db = require('./db')
const By = webdriver.By
const NonFatalError = require('./NonFatalError')

async function findErrorElement(driver, a, text, updateText) {
  let found = false

  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[text()='${text}']`)),
      1000);

    await db.updateCollection(a.colId, a.id, updateText)
    found = true
  } catch { }

  if (found) {
    throw new NonFatalError(updateText)
  }
}

async function findNullOwnerElement(driver, a) {
  let found = false

  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[contains(text(),"Owned by")]/a[.//*[contains(text(),"NullAddress")]]`)),
      1000);

    await db.updateCollection(a.colId, a.id, 'NullAddress')
    found = true
  } catch { }

  if (found) {
    throw new NonFatalError('NullAddress')
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

  await switchToWindow(driver, 0)
  windows = await driver.getAllWindowHandles()

  log.info(`Close windows: ${beforeCount}-${windows.length}`)
}

async function switchToWindow(driver, index) {
  let windows = await driver.getAllWindowHandles()

  if (windows.length > index) {
    await driver.switchTo().window(windows[index])
  }

  await h.sleep(1000)
}

module.exports = {
  findErrorElement,
  closeOtherWindows,
  switchToWindow,
  findNullOwnerElement,
}
