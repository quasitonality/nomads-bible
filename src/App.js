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
    <div className="App w-full">
      <article className='prose max-w-none prose-headings:m-0 flex flex-col items-center'>
        <h1 className='bg-base-200 w-full pb-3 pt-2'>Nomad's Bible</h1>
        <div className='flex w-full items-start'>
          <div className='card bg-base-200 m-4 p-4'>
            <JourneyForm calculate={calculateGraphData} />
          </div>
          <div className="divider h-full"></div>
          <div className='flex grow m-4 p-4'>
            <GraphView graphData={graphData} isCalculating={isCalculating} />
          </div>
        </div>
      </article>
    </div>
  );
}

export default App;
