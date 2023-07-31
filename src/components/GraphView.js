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
        return <div>{`${a} --> ${b}, $${cost}`}</div>
      })
    }
  } catch (err) {
    console.log(err.message)
  }

  if (isCalculating) return <h2>Calculating...</h2>
  return graphData ? (
    <div>
      {cards}
      <div>${graphData.graph.pathCost(...path)}</div>
    </div>
  ) : <h2>Let's Go!</h2>
}

export default GraphView