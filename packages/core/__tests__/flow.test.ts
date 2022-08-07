/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Flow } from '../src/flow'
import { flowStorage } from '../src/storage'
import { FlowState, FlowEvent } from '../src/flow'
import { nodeStorage } from '../lib/storage'


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
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })

  test('Flow state', () => {
    expect(flow.state).toBe(FlowState.CREATE)
  })

  test('Flow next 1', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(0)
    expect(flow.activateNodeID).not.toBe(null)
    expect(flow.activatedNode!.name).toBe('node1')
  })

  test('Flow next 2', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(1)
    expect(flow.activateNodeID).not.toBe(null)
    expect(flow.activatedNode!.name).toBe('node2')
  })

  test('Flow next 3', () => {
    flow.next()
    expect(flow.activatedIndex).toBe(-1)
    expect(flow.activateNodeID).toBe(null)
    expect(flow.state).toBe(FlowState.END)
  })

  test('Flow next 4', () => {
    expect(() => flow.next()).toThrowError()
  })
})



describe('Flow event', () => {
  const flow = new Flow({ name: 'test flow', nodes: [{ name: 'node1', type: 'node' }, { name: 'node2', type: 'node' }] })

  // eslint-disable-next-line jest/no-done-callback
  test('Event ON_NEXT', (done) => {
    flow.on(FlowEvent.ON_NEXT, (node) => {
      expect(node.name).toBe('test flow')
      expect(flow.activatedIndex).toBe(0)
      expect(flow.activateNodeID).not.toBe(null)
      expect(flow.activatedNode!.name).toBe('node1')
      done()
    })
    flow.next()
  })
})