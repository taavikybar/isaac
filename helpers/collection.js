const fs = require('fs');
const c = require('../constants')
const h = require('./helpers')
const log = require('./log')
const db = require('./db')

const MS_IN_H = 1000 * 60 * 60
const H_IN_DAY = 24

const isAssetValid = a => {
  if (a.lastBidDate === null) {
    return true
  }

  const hoursSince = Math.floor(
    (new Date() - new Date(a.lastBidDate))
    / MS_IN_H
  )

  if (h.isBid(a)) {
    return hoursSince > c.bidDays * H_IN_DAY
  }

  return hoursSince > c.otherRetryDays * H_IN_DAY
}

const getUrl = (colId, assetId) =>
  `${c.assetBaseUrl}/${getColById(colId).contract}/${assetId}`

const getColById = id => c.collections.find(col => col.id === id)

module.exports = {
  getUrl,
  getColById,
  isAssetValid,
}