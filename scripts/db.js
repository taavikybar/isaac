require('dotenv').config()
const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`

async function run() {
  const nano = require('nano')(DB_URL);
  const assets = await nano.use('assets')
  const docs = await assets.list()

  for (const row of docs.rows) {
    const colId = row.id
    const doc = await assets.get(colId)
  
    for (const a of doc.assets) {
      a.id = a.assetId
      delete a.assetId
    }
  
    await assets.destroy(colId, doc._rev)
    await assets.insert({
      assets: doc.assets
    }, colId)
  }
}

run()