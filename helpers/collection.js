
const fs = require('fs');
const c = require('./constants')
const h = require('./helpers')

async function getCollection(colName) {
  const data = await fs.readFileSync(`./assets/${colName}.json`, 'utf8')
  return JSON.parse(data)
}

const isAssetValid = asset => !asset.bids[h.getDateKey()]
const getUrl = (colName, id) => `${c.assetBaseUrl}/${c.collections[colName].contract}/${id}`

async function updateCollection(colName, id, bid) {
  const collection = await getCollection(colName)
  const index = collection.findIndex(a => a.id === id)

  collection[index].bids[h.getDateKey()] = bid

  await fs.writeFileSync(`./assets/${colName}.json`, JSON.stringify(collection))
}

module.exports = {
  getCollection,
  isAssetValid,
  getUrl,
  updateCollection,
}


// async function createReport() {
//   if (fs.existsSync(getReportFilename())) {
//     console.log('exists')
//   } else {
//     await fs.writeFileSync(getReportFilename(), '[]')
//   }
// }


// const getReportFilename = () => `./reports/${h.getDateKey()}.json`