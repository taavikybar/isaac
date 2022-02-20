require('dotenv').config()
const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`

async function run() {
  const nano = require('nano')(DB_URL);
  const assets = await nano.use('assets')
  const colId = 'cryptofighters'
  const doc = await assets.get(colId)

  // await assets.destroy(colId, doc._rev)
  await assets.insert({
    assets: doc.assets
  }, colId+"-")
  // console.log(newData)

}

run()