const { Flow } = require("../lib")
const { FlowState, FlowEvent } = require("../lib/flow")


describe('Create flow', () => {
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }] })

  test('Flow state', () => {
    expect(flow.state).toBe(FlowState.READY)
  })

  test('Flow activateNodeIndex', () => {
    expect(flow.activatedIndex).toBe(-1)
  })

  test('Flow activateNodeID', () => {
    expect(flow.activatedNodeID).toBe(null)
  })

  test('Flow activateNode', () => {
    expect(flow.activatedNode).toBe(null)
  })
})


describe('Flow next method', () => {
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })

  test('Flow state', () => {
    expect(flow.state).toBe(FlowState.READY)
  })

  test('Flow next 1', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(0)
    expect(flow.activatedNodeID).not.toBe(null)
    expect(flow.activatedNode.name).toBe('node1')
  })

  test('Flow next 2', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(1)
    expect(flow.activatedNodeID).not.toBe(null)
    expect(flow.activatedNode.name).toBe('node2')
  })

  test('Flow next 3', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(-1)
    expect(flow.activatedNodeID).toBe(null)
    expect(flow.state).toBe(FlowState.END)
  })

  test('Flow next 4', () => {
    try {
      flow.next()
    } catch (e) {
      expect(e.message).toContain('END')
    }
  })
})



describe('Flow event', () => {
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })

  test('Event ON_NEXT', (done) => {
    flow.on(FlowEvent.ON_NEXT, (node) => {
      expect(node.name).toBe('test flow')
      expect(flow.activatedIndex).toBe(0)
      expect(flow.activatedNodeID).not.toBe(null)
      expect(flow.activatedNode.name).toBe('node1')
      done()
    })
    flow.next()
  })
})