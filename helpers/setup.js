const webdriver = require("selenium-webdriver");
const By = webdriver.By
const chrome = require("selenium-webdriver/chrome");
const h = require('./helpers')

async function setup() {
    // setup
    const options = new chrome.Options();

    options.addArguments(`user-data-dir=${process.env.USER_DATA_PATH}`)
    options.addArguments("profile-directory=Profile 1")
    options.addExtensions(process.env.EXTENSION_PATH)
  
    let driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
  
    // start
    driver.navigate().to("https://google.com");
    await h.sleep(2000)
    let windows = await driver.getAllWindowHandles()
    await driver.switchTo().window(windows[0])
  
    // unlock metamask
    await  h.sleep(2000)
    let el = await driver.findElement(By.tagName('input'));
    await driver.wait(webdriver.until.elementIsVisible(el), 10000);
    await el.sendKeys(process.env.PASS);
    let btn = await driver.findElement(By.tagName('button'));
    await btn.click()
    await driver.close()

    return driver
}

module.exports = {
  setup,
}