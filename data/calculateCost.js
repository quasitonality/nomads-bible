const { FlightCost, Location } = require('./db')
const axios = require('axios')

const calculateCost = async (fromId, toId) => {
  let cachedCost = await FlightCost.findOne({
    originId: fromId,
    destinationId: toId
  })

  if (cachedCost === null) {
    const fromPlace = await Location.findById(fromId)
    const queryFrom = fromPlace.locationType === 'PLACE_TYPE_CITY' ?
      {iata: fromPlace.cityCode} : {entityId: fromPlace.countryCode}

    const toPlace = await Location.findById(toId)
    const queryTo = toPlace.locationType === 'PLACE_TYPE_CITY' ?
      {iata: toPlace.cityCode} : {entityId: toPlace.countryCode}

    const options = {
      method: 'POST',
      url: 'https://skyscanner65.p.rapidapi.com/api/v1/flights/indicative/search',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '38d596898cmsh63fb8790088bf81p13379bjsn14c6201478e9',
        'X-RapidAPI-Host': 'skyscanner65.p.rapidapi.com'
      },
      data: {
        query: {
          market: 'US',
          locale: 'en-US',
          currency: 'USD',
          queryLegs: [
            {
              originPlace: {
                queryPlace: queryFrom
              },
              destinationPlace: {
                queryPlace: queryTo
              },
              anytime: true
            }
          ]
        }
      }
    }
    const response = await axios(options)
    const quotes = response.data.content.results.quotes
    let cost
    for (const key in quotes) {
      const { minPrice } = quotes[key]
      const amount = Number(minPrice.amount)
      if (cost === undefined || amount < cost) cost = amount
    }
    cachedCost = await FlightCost.create({
      originId: fromId,
      destinationId: toId,
      cost: cost,
      updatedAt: new Date()
    })
  }

  return cachedCost.cost
}

module.exports = calculateCost