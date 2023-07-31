class Graph {
  constructor () {
    this._nodes = {}
  }

  get nodes () { return this.values.map(val => this._nodes[val]) }

  get values () { return Object.keys(this._nodes).map(key => this._nodes[key].value) }

  get size () { return this.values.length }

  includes (value) {
    return !(this._nodes[value] === undefined)
  }

  find (value) {
    return this._nodes[value]
  }

  insert (value) {
    let node
    if (this.includes(value)) {
      node = this.find(value)
    } else {
      node = new GraphNode(value)
      this._nodes[value] = node
    }
    return node
  }

  link (fromValue, toValue, cost) {
    let fromNode = this.find(fromValue)
    let toNode = this.find(toValue)
    if (!(fromNode && toNode)) {
      throw new Error('Attempted to link unincluded values')
    } else {
      fromNode.link(toNode, cost)
    }
  }

  linkAll (cost, overwrite) {
    for (let key in this._nodes) {
      let fromNode = this._nodes[key]
      for (let key in this._nodes) {
        let toNode = this._nodes[key]
        if (fromNode !== toNode && (overwrite || !fromNode.hasLink(toNode))) {
          fromNode.link(toNode, cost)
        }
      }
    }
  }

  pathCost (...stops) {
    return stops.reduce((acc, value, index)=>{
      if (index === stops.length - 1) return acc
      return acc + this.find(value).getLinkCost(stops[index + 1])
    }, 0)
  }

  pathCostBreakdown (...stops) {
    const costs = []
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i]
      const b = stops[i + 1]
      costs.push(this.find(a).getLinkCost(b))
    }
    return costs
  }

  findMinimumTraversal(startValue, doReturn, maxStops) {
    const permutations = []
    const values = this.values
    const stops = values.slice()
    stops.splice(stops.indexOf(startValue), 1)
    if (maxStops === undefined) maxStops = stops.length

    const permutate = (arrayLeft, arrayRight, depth) => {
      if (arrayRight.length === 0 || depth === maxStops) {
        permutations.push(arrayLeft)
        return
      }
      arrayRight.forEach((value, index)=>{
        const copyRight = arrayRight.slice()
        copyRight.splice(index, 1)
        permutate(arrayLeft.concat([value]), copyRight, depth + 1)
      })
    }
    permutate([], stops, 0)
    let minCost
    let minCostPath = []
    permutations.forEach((perm)=>{
      let path = [startValue].concat(perm)
      if (doReturn) path.push(startValue)
      let pathCost = this.pathCost(...path)
      if (minCost === undefined || pathCost < minCost) {
        minCost = pathCost
        minCostPath = path
      }
    })

    return minCostPath
  }
}

class GraphNode {
  constructor (value) {
    this._value = value
    this._links = {}
  }

  link (node, cost) {
    if (node === this) {
      throw new Error('Cannot link a node to itself')
    }
    this._links[node.value] = { node, cost }
  }

  hasLink(node) {
    return this._links[node.value] ? true : false
  }

  getLinkCost(value) {
    return this._links[value].cost
  }

  get links () {
    return Object.keys(this._links).map(key => this._links[key])
  }

  get value () { return this._value }
}

export default Graph