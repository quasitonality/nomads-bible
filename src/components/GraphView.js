function GraphView ({isCalculating, graphData}) {

  console.log(graphData)
  let cards = []
  let path = []
  try {
    if (graphData) {
      const {graph, start, doReturn} = graphData
      path = graph.findMinimumTraversal(start, doReturn)
      const costs = graph.pathCostBreakdown(...path)
      cards = costs.map((cost, i) => {
        let a = path[i]
        let b = path[i + 1]
        return (
          <div className='card bg-base-200 p-4 m-4'>
            <h3 className='italic'>{`${a} --> ${b}, $${cost}`}</h3>
          </div>

        )
      })
    }
  } catch (err) {
    console.log(err.message)
  }

  if (isCalculating) return <h2 className='w-full' >Calculating...</h2>
  return graphData ? (
    <div className='grow'>
      <h2 className='grow w-full' >Lowest Cost Path:</h2>
      {cards}
      <h2>${graphData.graph.pathCost(...path)}</h2>
    </div>
  ) : <h2 className='grow w-full italic'>Let's Go!</h2>
}

export default GraphView