const db = require('../helpers/db');

const remove = async () => {
  await db.deleteTable('workers', process.env.ID)
}

remove()