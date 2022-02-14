const fs = require('fs');
const c = require('../constants')


async function clean() {
  await Object.keys(c.collections).forEach(async colName => {
    const file = await fs.readFileSync(`./assets/${colName}.json`, 'utf8')
    const assets = JSON.parse(file)
    const newAssets = []

    assets.forEach(a => {
      if (!a.bids.find(b => b.bid === '404')) {
        newAssets.push(a)
      }
    })

    console.log(`\n${colName}`)
    console.log(`assets: ${assets.length}, cleaned assets: ${newAssets.length}, 404 found: ${assets.length - newAssets.length}`)

    await fs.writeFileSync(`./assets/${colName}.json`, JSON.stringify(newAssets))
  })
}

clean()