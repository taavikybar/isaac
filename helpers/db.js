
let c = require('../constants')

async function loadConfig() {
  const nano = require('nano')(
    `http://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`);

  const config = await nano.use('config')
  const global = await config.get('global')

  Object.keys(global).forEach(k => {
    c[k] = global[k]
  })
}

module.exports = {
  loadConfig,
}