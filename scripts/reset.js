const fs = require('fs');


async function addToCollection(collectionName) {
  const file = await fs.readFileSync(`./assets/${collectionName}.json`, 'utf8')
  const collection = JSON.parse(file)

  collection.forEach((c,i) => {

    if (c.bids.find(b => b.bid === 'bids present') || c.bids.find(b => b.bid === 'error')) {
      collection[i].bids = []
    }

  })

  // collection.forEach((c,i) => {
  //   console.log(c)
  // })

  await fs.writeFileSync(`./assets/${collectionName}.json`, JSON.stringify(collection))
}


addToCollection('cryptofighters')