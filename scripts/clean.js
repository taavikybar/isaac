const fs = require('fs');
const c = require('../constants')
const db = require('../helpers/db');
const log = require('../helpers/log');


async function clean() {
  await db.loadConfig()

  for (col of c.collections) {
    const file = await fs.readFileSync(`./assets/${col.id}.json`, 'utf8')
    const assets = JSON.parse(file)
    const newAssets = []

    assets.forEach(a => {
      if (!a.bids.find(b => b.bid === '404')) {
        newAssets.push(a)
      }
    })

    log(`${col.id}: assets: ${assets.length}, cleaned assets: ${newAssets.length}, 404 found: ${assets.length - newAssets.length}`)

    await fs.writeFileSync(`./assets/${col.id}.json`, JSON.stringify(newAssets))
  }
}

module.exports = clean