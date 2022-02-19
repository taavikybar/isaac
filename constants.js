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
  text504: '504',
  update404: '404',
  update504: '504',
  offerSubmitted: 'Your offer was submitted successfully!',
  uncertainBid: 'uncertain bid',
  limitReached: "API Error 400: ['Outstanding order to wallet balance ratio exceeds allowed limit.']",
  limitInEth: 1018, // per 1 ETH in wallet
  minToWait: 0,

  bidsMade: 0,
  bidDays: 3,
  ethInWallet: 1.4,

  collections: {
    // cryptofighters: {
    //   contract: '0x87d598064c736dd0c712d329afcfaa0ccc1921a1',
    //   toBid: 0.1,
    //   useBid: false,
    // },
    // mooncats: {
    //   contract: '0xc3f733ca98e0dad0386979eb96fb1722a1a05e69',
    //   toBid: 0.3,
    //   useBid: false,
    // },
    // cryptocards: {
    //   contract: '0x3a7dc718eaf31f0a55988161f3d75d7ca785b034',
    //   toBid: 0.08,
    //   useBid: false,
    // },
    // etherlambos: {
    //   contract: '0xda9f43015749056182352e9dc6d3ee0b6293d80a',
    //   toBid: 0.3,
    //   useBid: false,
    // },
    // pixereum: {
    //   contract: '0x6f9d53ba6c16fcbe66695e860e72a92581b58aed',
    //   toBid: 0.04,
    //   useBid: false,
    // },
    cryptobots: {
      contract: '0xf7a6e15dfd5cdd9ef12711bd757a9b6021abf643',
      toBid: 0.08,
      useBid: false,
    },
    deepblack: {
      contract: '0xd70f41dd5875eee7fa9dd8048567bc932124a8d2',
      toBid: 0.15,
      useBid: false,
    }
  },
}