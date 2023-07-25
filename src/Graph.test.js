import Graph from './Graph.js'

describe('Graph', ()=>{
  var graph

  beforeEach(()=>{
    graph = new Graph()
  })

  it('Should exist and be a class', ()=>{
    expect(typeof Graph).toBe('function')
    expect(typeof graph).toBe('object')
  })

  it('Should push new nodes to the node list', ()=>{
    graph.insert(1)
    expect(graph.nodes[0].value).toBe(1)
  })

  it('Should report size as number of nodes in the graph', ()=>{
    expect(graph.size).toBe(0)
    graph.insert(1)
    graph.insert(2)
    expect(graph.size).toBe(2)
  })

  it('Should not accept duplicate values', ()=> {
    graph.insert(1)
    graph.insert(1)
    expect(graph.size).toBe(1)
  })

  it('Should not allow external mutation of node list', ()=> {
    graph.insert(1)
    graph.insert(2)
    graph.insert(3)
    try { graph.nodes = [] } catch {}
    expect(graph.nodes.length).toBe(3)
    let nodes = graph.nodes
    nodes.push(4)
    expect(graph.nodes.length).toBe(3)
  })

  it('Should establish links between nodes', ()=>{
    let node1 = graph.insert(1)
    let node2 = graph.insert(2)
    graph.link(1, 2, 3)
    expect(node1.links[0].node).toBe(node2)
    expect(node1.links[0].cost).toBe(3)
  })

  it('Should error when linking a node to itself', ()=>{
    graph.insert(1)
    expect(()=>{
      graph.link(1, 1, 2)
    }).toThrow('Cannot link a node to itself')
  })

  it('Should error when linking values that do not exist', ()=>{
    graph.insert(1)
    expect(()=>{
      graph.link(1, 2, 3)
    }).toThrow('Attempted to link unincluded values')

    graph = new Graph()
    graph.insert('b')
    expect(()=>{
      graph.link('a', 'b', 3)
    }).toThrow('Attempted to link unincluded values')
  })

  it('Should not create duplicate links', ()=>{
    let node1 = graph.insert(1)
    graph.insert(2)
    graph.link(1, 2, 3)
    graph.link(1, 2, 5)
    expect(node1.links.length).toBe(1)
  })

  it('Should update cost for already-existing links', ()=>{
    let node1 = graph.insert(1)
    graph.insert(2)
    graph.link(1, 2, 3)
    expect(node1.links[0].cost).toBe(3)
    graph.link(1, 2, 5)
    expect(node1.links[0].cost).toBe(5)
  })

  describe('Find Minimum Traversal', ()=>{
    beforeEach(()=>{
      graph = new Graph()
      for (let x = 0; x < 5; x++) {
        graph.insert(x)
      }
      graph.linkAll(0)
    })

    it ('Should return an array', ()=>{
      expect(graph.findMinimumTraversal(1).isArray()).toBe(true)
    })

    it ('Should begin with the given value', ()=>{
      expect(graph.findMinimumTraversal(3)[0]).toBe(3)
    })

    it ('Should visit every node exactly once', ()=>{
      let test = graph.findMinimumTraversal(0)
      expect(test.length).toEqual(graph.size)
      expect(Graph.values.every(value => test.includes(value))).toBe(true)
    })

    it ('Should return to start if second parameter is set to true', ()=>{
      let test = graph.findMinimumTraversal(3)
      expect(test[0]).toBe(3)
      expect(test[test.length - 1]).toBe(3)
    })

    it ('Should find minimum cost traversal', ()=>{
      graph.link(3, 0, 0)
      graph.link(0, 2, 0)
      graph.link(2, 4, 0)
      graph.link(4, 1, 0)
      graph.link(1, 3, 0)
      expect(graph.findMinimumTraversal()).toEqual([3,0,2,4,1,3])
    })
  })

})