require('dotenv').config()
let c = require('../constants')
const log = require('./log');

async function loadConfig() {
  try {
    const DB_URL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`
    const nano = require('nano')(DB_URL);
    const config = await nano.use('config')
    const global = await config.get('global')
    const assets = await config.get('assets')

    Object.keys(global).forEach(k => {
      c[k] = global[k]
    })

    c.collections = assets.collections
    log('Config loaded')
  } catch (e) {
    log(`DB config load error: ${e}`)
  }
}

module.exports = {
  loadConfig,
}