const webdriver = require('selenium-webdriver');
const By = webdriver.By
const co = require('./collection')
const log = require('./log')
const h = require('./helpers')
const db = require('./db')
const c = require('../constants')
const NonFatalError = require('./NonFatalError')

async function findErrorElement(driver, a, text, updateText) {
  let found = false

  try {
    await driver.wait(
      webdriver.until.elementLocated(By.xpath(`//*[contains(.,'${text}')]`)),
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

    await db.updateCollection(a.colId, a.id, c.nullAddress)
    found = true
  } catch { }

  if (found) {
    throw new NonFatalError(c.nullAddress)
  }
}

async function closeOtherWindows(driver) {
  let windows = await driver.getAllWindowHandles()

  if (windows.length > 1) {
    for (w of windows) {
      await driver.switchTo().window(w)
      await driver.close()
    }
  }

  await switchToWindow(driver, 0)
}

async function switchToWindow(driver, index) {
  let windows = await driver.getAllWindowHandles()

  if (windows.length > index) {
    await driver.switchTo().window(windows[index])
  }

  await h.sleep(1000)
}

async function checkForWelcomeToOSModal(driver) {
  const windows = await driver.getAllWindowHandles()

  if (windows.length > 1) {
    await switchToWindow(driver, 1)

    await driver.wait(webdriver.until.elementLocated(
      By.xpath(`//*[contains(text(),'${c.welcomeToOSText}')]`)), 1000);

    const signBtn = await driver.findElement(By.xpath(`//button[text()='${c.signButtonText}']`))
    await signBtn.click()
    await switchToWindow(driver, 0)
  }
}

async function checkForPermissionModal(driver) {
  await driver.wait(webdriver.until.elementLocated(
    By.xpath(`//*[contains(text(),'${c.permissionModalText}')]`)), 1000);

  const rejectBtn = await driver.findElement(
    By.xpath(`//button[text()='${c.rejectButtonText}']`))

  await rejectBtn.click()
  await switchToWindow(driver, 1)
}

module.exports = {
  findErrorElement,
  closeOtherWindows,
  switchToWindow,
  findNullOwnerElement,
  checkForWelcomeToOSModal,
  checkForPermissionModal,
}
