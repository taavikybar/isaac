module.exports = {
  loginUrl: 'https://opensea.io/login?referrer=%2Faccount',
  offerButtonTxt: 'Make offer',
  finalOfferButtonTxt: 'Make Offer',
  bidButtonTxt: 'Place bid',
  nOofferxTxt: 'No offers yet',
  inputPlaceholder: 'Amount',
  assetBaseUrl: 'https://opensea.io/assets',
  bidPresent: 'bids present',
  signButtonText: 'Sign',
  text404: 'This page is lost.',
  update404: '404',
  offerSubmitted: 'Your offer was submitted successfully!',
  uncertainBid: 'uncertain bid ',

  bidsMade: 0,
  bidDays: 3,

  collections: {
    cryptofighters: {
      contract: '0x87d598064c736dd0c712d329afcfaa0ccc1921a1',
      toBid: 0.05,
      useBid: false,
    },
    mooncats: {
      contract: '0xc3f733ca98e0dad0386979eb96fb1722a1a05e69',
      toBid: 0.2,
      useBid: false,
    },
    cryptocards: {
      contract: '0x3a7dc718eaf31f0a55988161f3d75d7ca785b034',
      toBid: 0.05,
      useBid: false,
    },
    etherlambos: {
      contract: '0xda9f43015749056182352e9dc6d3ee0b6293d80a',
      toBid: 0.2,
      useBid: false,
    }
  },

  collectionToRun: 'mooncats',
}