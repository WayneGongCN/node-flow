import { Node, NodeState } from '../src/node'


describe('Create Node', () => {
  const node = Node.create({ name: 'node', type: 'node' })

  test('Node name', () => {
    expect(node.name).toBe('node')
  })

  test('Node state', () => {
    expect(node.state).toBe(NodeState.CREATE)
  })
})
