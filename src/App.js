import './App.css';
import JourneyForm from './components/JourneyForm.js'
import GraphView from './components/GraphView.js'
import { useState } from 'react'
import Graph from './Graph.js'

function App() {
  const [graphData, setGraphData] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateGraphData = async (cb) => {
    setGraphData(null)
    setIsCalculating(true)
    let data = await cb()
    setGraphData(data)
    setIsCalculating(false)
  }

  return (
    <div className="App">
      <h1>Nomad's Bible</h1>
      <div className='flex items-center'>
        <div className='width-3/12'>
          <JourneyForm calculate={calculateGraphData} />
        </div>
        <div>
          <GraphView graphData={graphData} isCalculating={isCalculating} />
        </div>
      </div>
    </div>
  );
}

export default App;
