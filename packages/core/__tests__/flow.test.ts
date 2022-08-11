import { Flow } from '../src/flow'
import { flowStorage } from '../src/storage'
import { FlowState } from '../src/flow'
import { nodeStorage } from '../src/storage'


beforeEach(() => {
  flowStorage.clear()
  nodeStorage.clear()
})

afterEach(() => {
  flowStorage.clear()
  nodeStorage.clear()
})



describe('Create flow', () => {
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }] })

  test('Flow state', () => {
    expect(flow.state).toBe(FlowState.CREATE)
  })

  test('Flow activateNodeIndex', () => {
    expect(flow.activatedIndex).toBe(-1)
  })

  test('Flow activateNodeID', () => {
    expect(flow.activateNodeID).toBe(null)
  })

  test('Flow activateNode', () => {
    expect(flow.activatedNode).toBe(null)
  })
})


describe('Flow activate', () => {
  test('getActivatedFlow', async () => {
    const flow = await Flow.getActivatedFlow()
    expect(flow).toBe(null)
  })


  test('activate', async () => {
    const flow = new Flow({ name: 'test flow', nodes: [] })
    await flow.activate()
    const activatedFlow = await Flow.getActivatedFlow() as Flow
    expect(activatedFlow.id).toBe(flow.id)
  })

  test('remove an activate flow', async () => {
    const flow = new Flow({ name: 'test flow', nodes: [] })
    await flow.activate()
    await flow.remove()

    const activatedFlow = await Flow.getActivatedFlow()
    expect(activatedFlow).toBe(null)
  })
})


describe('Flow save', () => {
  test('save', async () => {
    const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })
    expect(() => flow.save()).not.toThrow()
  })
})


describe('Flow remove', () => {
  test('remove', async () => {
    const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })
    expect(() => flow.remove()).not.toThrow()
  })
})


describe('Flow next method', () => {
  test('Flow state', () => {
    const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })
    expect(flow.state).toBe(FlowState.CREATE)
  })
})
