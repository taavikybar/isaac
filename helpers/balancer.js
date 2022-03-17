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

const getLoadFromFree = free => {
  let load = []
  const cols = []
  free = h.shuffleArray(free)

  free.forEach(col => {
    if (load.length > c.minLoad) {
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
  let free = []
  const taken = await getTaken()
  const runnableCols = c.collections.filter(col => col.run)

  for (const col of runnableCols) {
    const assets = await db.getAssets(col.id)
    
    if (!assets) continue

    if (!taken.includes(col.id)) {
      free.push({
        id: col.id,
        assets: assets.filter(co.isAssetValid),
      })
    }
  }

  const load = getLoadFromFree(free)

  db.updateTable('workers', process.env.ID, {
    collections: load.cols,
    load: load.load.length,
  })

  log(`Load: ${load.load.length} assets`)

  return load.load
}

module.exports = {
  getLoad,
}