const fs = require('fs');


async function addToCollection(collectionName, id) {
  const file = await fs.readFileSync(`./assets/${collectionName}.json`, 'utf8')
  const collection = JSON.parse(file)

  data.forEach(d => {
    if (collection.find(a => a.id === d)) {
      return
    }

    collection.push({
      id: d,
      bids: [],
    })
  })

  await fs.writeFileSync(`./assets/${collectionName}.json`, JSON.stringify(collection))
}

const data = []
for (let i=1;i<72;i++) {
  data.push(i)
}

addToCollection('cryptocards', data)