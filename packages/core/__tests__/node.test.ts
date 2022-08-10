/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Node, NodeState, NodeEvent } from '../src/node'


describe('Create Node', () => {
  const node = Node.create({ name: 'node', type: 'node' })

  test('Node name', () => {
    expect(node.name).toBe('node')
  })

  test('Node state', () => {
    expect(node.state).toBe(NodeState.CREATE)
  })
})
