const rawLocations = require('./data/geolocations.json')
const fs = require('fs')

// Print location types
// const {places} = rawLocations
// const types = []
// for (const key in places) {
//   const place = places[key]
//   if (!types.includes(place.type)) types.push(place.type)
// }
// types.forEach((type) => { console.log(type) })

const validTypes = ['PLACE_TYPE_CITY', 'PLACE_TYPE_COUNTRY']
const isValid = type => validTypes.includes(type)

const {places} = rawLocations
const locations = []
for (const key in places) {

  const place = places[key]
  if (isValid(place.type)) {
    let country
    switch (place.type) {
      case 'PLACE_TYPE_CITY': country = place.parentId; break
      case 'PLACE_TYPE_COUNTRY': country = place.entityId; break
      default: break
    }
    locations.push({
      name: place.name,
      locationType: place.type,
      cityCode: place.iata,
      countryCode: country
    })
  }
}

fs.writeFile('./data/locations.json', JSON.stringify(locations, null, 2), ()=>{
  console.log('Write Complete')
})