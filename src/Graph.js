class Graph {
  constructor () {
    this._nodes = []
  }

  get nodes () { return this._nodes.slice(0) }

  get values () { return this._nodes.map(node => node.value) }

  get size () { return this._nodes.length }

  includes (value) {
    return !this._nodes.every(node => node.value !== value)
  }

  find (value) {
    return this._nodes.find(node => node.value === value)
  }

  insert (value) {
    let node
    if (this.includes(value)) {
      node = this.find(value)
    } else {
      node = new GraphNode(value)
      this._nodes.push(node)
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
    this._nodes.forEach((fromNode)=>{
      this._nodes.forEach((toNode)=>{
        if (fromNode !== toNode && (overwrite || !fromNode.hasLink(toNode))) {
          fromNode.link(toNode, cost)
        }
      })
    })
  }
}

class GraphNode {
  constructor (value) {
    this._value = value
    this._links = []
  }

  link (node, cost) {
    if (node === this) {
      throw new Error('Cannot link a node to itself')
    }
    let link = this._links.find(link => link.node === node)
    if (link) {
      link.cost = cost
    } else {
      this._links.push({node, cost})
    }
  }

  hasLink(node) {
    return this._links.find(link => link.node === node) ? true : false
  }

  get links () {
    return this._links.map(link => Object.create(link))
  }

  get value () { return this._value }
}

export default Graph