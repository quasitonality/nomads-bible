const mongoose = require('mongoose')
const locations = require('./locations.json')
const { Schema, model } = mongoose

mongoose.connect('mongodb://127.0.0.1:27017/nomads-bible')

const flightCostSchema = new Schema({
  originId: Schema.Types.ObjectId,
  destinationId: Schema.Types.ObjectId,
  cost: Number,
  updatedAt: Date
})

const locationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    dropDups: true
  },
  locationType: String,
  cityCode: String,
  countryCode: String
})

const FlightCost = model('flightCost', flightCostSchema)
const Location = model('location', locationSchema)

Location.insertMany(locations)

module.exports = { FlightCost, Location }