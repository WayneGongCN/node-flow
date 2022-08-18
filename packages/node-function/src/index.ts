import { Node, NodeData, NodeFlowEvent } from '@node-flow/core'
import { NodeVM } from 'vm2'


export interface FunctionNodeData<P, R> extends NodeData {
  fnStr?: string;
}


class FunctionNode<P, R> extends Node<FunctionNodeData<P, R>> {
  static type = 'node-function'

  constructor(options: FunctionNodeData<P, R>) {
    super(options)
  }


  async run(event: NodeFlowEvent) {
    const fnStr = this.options.fnStr
    if (!fnStr) throw new Error('function error')

    const vm = new NodeVM({ sandbox: { console: this.logger }, require: { external: true } })
    const fnInVM = await vm.run(fnStr, 'none')

    if (!fnInVM) throw new Error('not found module.exports function')
    return (await fnInVM(event)) as NodeFlowEvent
  }


  serialize() {
    return {
      ...super.serialize(),
      fnStr: this.options.fnStr
    }
  }
}


export default FunctionNode
