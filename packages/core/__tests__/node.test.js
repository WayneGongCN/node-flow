const { createNode, NodeState, NodeEvent } = require('../lib/node')


describe('Create Node', () => {
  const node = createNode({ name: 'node', type: 'node' })

  test('Node name', () => {
    expect(node.name).toBe('node')
  })

  test('Node state', () => {
    expect(node.state).toBe(NodeState.CREATE)
  })

  // test('Node type', () => {
  //   expect(node.type).toBe('node')
  // })

})


describe('Node event', () => {
  const node = createNode({ name: 'node', type: 'node' })

  test('Event ON_STATE_CHANGE', (done) => {
    node.on(NodeEvent.ON_STATE_CHANGE, (n) => {
      expect(n.state).toBe(NodeState.ACTIVATE)
      done()
    })
    node.state = NodeState.ACTIVATE
  })
})
