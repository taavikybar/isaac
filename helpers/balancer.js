const log = require('./log')
const db = require('./db')
const h = require('./helpers')
const c = require('../constants')
const co = require('./collection')


const getTaken = async () => {
  let taken = []
  const workersData = await db.getDb('workers')

  workersData
    .filter(w => w.id !== process.env.ID)
    .forEach(w => {
      taken = [...taken, ...w.collections]
    })

  return taken
}

const getLoadFromFree = (free, perWorker) => {
  let load = []
  const cols = []
  free = h.shuffleArray(free)

  free.forEach(col => {
    if (load.length > perWorker) {
      return false
    }

    load = [...load, ...col.assets]
    cols.push(col.id)

    log(`Added ${col.id} with ${col.assets.length}, total ${load.length}`)
  })

  return {
    load,
    cols,
  }
}

const getLoad = async () => {
  let total = 0
  let free = []
  const taken = await getTaken()
  const nrOfWorkers = Object.keys(c.wallets).length
  const runnableCols = c.collections.filter(col => col.run)

  for (const col of runnableCols) {
    let assets = await db.getAssets(col.id)
    assets = assets.filter(co.isAssetValid)
    total = total + assets.length

    if (!taken.includes(col.id)) {
      free.push({
        id: col.id,
        assets,
      })
    }
  }

  const perWorker = Math.floor(total / nrOfWorkers)
  const load = getLoadFromFree(free, perWorker)

  db.updateTable('workers', process.env.ID, {
    collections: load.cols,
    load: load.load.length,
  })

  log(`Load: ${load.load.length} assets, perWorker: ${perWorker}`)

  return load.load
}

module.exports = {
  getLoad,
}