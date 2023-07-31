import { useState, useEffect } from 'react'
import axios from 'axios'
import Graph from '../Graph.js'


function JourneyForm ({calculate}) {
  const [destinationCount, setDestinationCount] = useState(3)
  const [loading, setLoading] = useState(false)
  const [locations, setLocations] = useState([])
  const [start, setStart] = useState({})
  const [destinations, setDestinations] = useState([])
  const [doReturn, setDoReturn] = useState(false)
  const [defaultPlaces, setDefaultPlaces] = useState([])

  // useEffect(()=>{
  //   console.log('Start:', start)
  //   console.log('Dests:', destinations)
  // }, [start, destinations])

  useEffect(()=>{
    const fetchLocations = async ()=>{
      console.log('Fetching Countries')
      setLoading(true)
      let countries = (await axios.get('http://localhost:8080/countries')).data
      // console.log('Fetching Cities')
      // for (const country of countries) {
      //   country.cities = (await axios.get(`http://localhost:8080/countries/${country.countryCode}`)).data
      // }
      console.log('Done')
      setLocations(countries)
      setStart(countries.find(place => place.name === 'United States'))
      setDestinations([
        countries.find(place => place.name === 'Mexico'),
        countries.find(place => place.name === 'Canada'),
        countries.find(place => place.name === 'Argentina')
      ])
      setDefaultPlaces(['United States', 'Mexico', 'Canada', 'Argentina'].map((name)=>{
        return countries.indexOf(countries.find(place => place.name === name))
      }))
      setLoading(false)
    }
    fetchLocations()
  }, [])

  const handleChangeStart = (e)=>{
    const value = e.target.value
    setStart(locations[value])
  }

  const destinationHandler = (index)=>{
    return (e)=>{
      destinations[index] = locations[e.target.value]
      setDestinations(destinations.slice())
    }
  }

  const handleGo = ()=>{
    calculate(async ()=>{
      let graph = new Graph()
      graph.insert(start.name)
      destinations.forEach((destination)=>{
        graph.insert(destination.name)
      })
      for (const dest of destinations) {
        const cost =
          (await axios.get(`http://localhost:8080/cost/${start._id}/${dest._id}`)).data
        graph.link(start.name, dest.name, cost)
        if (doReturn) {
          const returnCost =
            (await axios.get(`http://localhost:8080/cost/${dest._id}/${start._id}`)).data
          graph.link(dest.name, start.name, returnCost)
        }
      }
      for (const fromLoc of destinations) {
        for (const toLoc of destinations) {
          if (fromLoc === toLoc) continue
          const cost =
            (await axios.get(`http://localhost:8080/cost/${fromLoc._id}/${toLoc._id}`)).data
          graph.link(fromLoc.name, toLoc.name, cost)
        }
      }
      return {
        graph: graph,
        start: start.name,
        doReturn: doReturn
      }
    })
  }

  const destinationSelectors = []
  for (let x = 0; x < destinationCount; x++) {
    destinationSelectors.push((
      <div key={'select-' + x}>
        <select name='destination' defaultValue={defaultPlaces[x + 1]} onChange={destinationHandler(x)} >
          {locations.map((country, index)=>{
            const op =
              <option value={index} key={'select-' + x + '-' + index} >{country.name}</option>
            return op
          })}
        </select>
      </div>
    ))
  }

  const handleReturn = (e)=>{
    setDoReturn(e.target.checked)
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return loading ? <h2>Loading...</h2> :
  (
    <div>
      <h2 hidden={!loading}>Loading...</h2>
      <div hidden={loading}>
        <h2>Your Journey</h2>
        <form action='dialog' onSubmit={handleSubmit} hidden={loading}>
          <div className='flex flex-col'>
            <label>Start</label>
            <select name='start' onChange={handleChangeStart} defaultValue={defaultPlaces[0]}>
              {locations.map((country, index)=>{
                const op = <option value={index} key={'select-start-' + index} >{country.name}</option>
                return op
              })}
            </select>
            <label>Destinations</label>
            {destinationSelectors}
            <button className='btn' onClick={()=>{setDestinationCount(destinationCount + 1)}}>Add a Stop</button>
            <label>Return?</label>
            <input type='checkbox' onChange={handleReturn} />
          </div>
          <button className='btn' onClick={handleGo}>Go</button>
          </form>
      </div>
    </div>
  )
}

export default JourneyForm