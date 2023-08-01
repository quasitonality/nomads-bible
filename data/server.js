const db = require('./db.js')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require ('morgan')
const cors = require('cors')
const calculateCost = require('./calculateCost.js')
const PORT = 8080


const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('common'))

// Return list of cities in country
app.get('/countries/:countryCode', (req, res)=>{
  db.Location.find({
    locationType: 'PLACE_TYPE_CITY',
    countryCode: req.params.countryCode
  })
  .then((result)=>{
    res.status(200)
    res.send(result)
  })
  .catch(()=>{
    res.sendStatus(418)
  })
})

// Return list of countries
app.get('/countries', (req, res)=>{
  db.Location.find({
    locationType: 'PLACE_TYPE_COUNTRY'
  })
  .then((result)=>{
    res.status(200)
    res.send(result)
  })
  .catch(()=>{
    res.sendStatus(418)
  })
})

// Return cost of traveling from location to location
app.get('/cost/:fromLocationId/:toLocationId', (req, res)=>{
  const {fromLocationId, toLocationId} = req.params
  calculateCost(fromLocationId, toLocationId)
  .then((result)=>{
    res.status(200)
    res.send(JSON.stringify(result))
  })
  .catch((err)=>{
    console.log(err.message)
    res.sendStatus(418)
  })
})

app.use('/', (req, res)=>{
  res.sendStatus(404)
})

app.listen(PORT)
console.log('Listening on port', PORT)