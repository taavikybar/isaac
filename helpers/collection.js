const fs = require('fs');
const c = require('./constants')

const assetsPath = './assets'

async function getCollection(colName) {
  const data = await fs.readFileSync(`${assetsPath}/${colName}.json`, 'utf8')
  return JSON.parse(data)
}

const isAssetValid = asset => !asset.bids[getDateKey()]

function getDateKey() {
  const d = new Date()
  const year = `${d.getFullYear()}`.split('')
  return`${d.getDay()}-${d.getMonth()}-${year[2]}${year[3]}`
}

const getUrl = (colName, id) => `${c.assetBaseUrl}/${c.collections[colName].contract}/${id}`

module.exports = {
  getCollection,
  isAssetValid,
  getUrl,
}


// async function createReport() {
//   if (fs.existsSync(getReportFilename())) {
//     console.log('exists')
//   } else {
//     await fs.writeFileSync(getReportFilename(), '[]')
//   }
// }


// const getReportFilename = () => `./reports/${getDateKey()}.json`