import { Node, NodeData, NodeFlowEvent, registerNode } from '@node-flow/core'
import {NodeVM} from 'vm2'


export interface FunctionNodeData<P, R> extends NodeData {
  fnStr?: string;
}


class FunctionNode<P, R> extends Node<FunctionNodeData<P, R>> {
  static type = 'node-function'

  constructor(options: FunctionNodeData<P, R>) {
    super(options)
  }

  async run(event: NodeFlowEvent) {
    this.logger.info('Hello from function node', event)
    const fnStr = this.options.fnStr
    if (!fnStr) throw new Error('function error')

    const vm = new NodeVM({ sandbox: { console: this.logger } })
    const fnInVM = await vm.run(fnStr)

    if (!fnInVM) throw new Error('not found module.exports function')
    const result  = await fnInVM(event)
    this.setScope(event, result)

    return event
  }

  serialize() {
    return {
      ...super.serialize(),
      fnStr: this.options.fnStr
    }
  }
}


registerNode(FunctionNode)
export default FunctionNode
