class Graph {
  constructor () {
    this._nodes = {}
  }

  get nodes () { return Object.create(this._nodes) }

  get values () { return this._nodes.keys() }

  get size () { return this._nodes.keys().length }

  includes (value) {
    return !!(this._nodes[value])
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

  get links () {
    return this._links.keys().map(key => this._links[key])
  }

  get value () { return this._value }
}

export default Graph