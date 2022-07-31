import EventEmitter from 'events'
import { v4 as uuid } from 'uuid'
import log4js from './logger'
import { checkoutNode, Node, NodeData as NodeData, NodeState } from './node'
import { flowStorage } from './storage'

const logger = log4js.getLogger('flow')

export interface FlowData {
  name: string;
  nodes: Node['id'][] | NodeData[]
}

export enum FlowState {
  INIT,
  CREATE,
  READY,
  RUNNING,
  END
}

export enum FlowEvent {
  ON_STATE_CHANGE = 'ON_STATE_CHANGE',
  ON_REGISTER = 'ON_REGISTER',
  ON_NEXT = 'ON_NEXT'
}


export class Flow extends EventEmitter {
  public id: string
  public flowState: FlowState
  public name: string

  public nodeMap: Record<Node['id'], Node>
  public nodeList: Node[]
  public activatedIndex: number
  public activatedNodeID: Node['id'] | null

  public ctx: unknown

  static save(flow: Flow) {
    flowStorage.set(`flows.${flow.id}`, flow.serialize())
  }


  static checkout(flowID: string) {
    const flowData = flowStorage.get(`flows.${flowID}`) as FlowData
    return new Flow(flowData)
  }


  constructor(opt: FlowData) {
    super()
    this.id = uuid()
    this.flowState = FlowState.INIT
    this.nodeMap = {}
    this.nodeList = []
    this.activatedIndex = -1
    this.activatedNodeID = null

    const { name, nodes } = opt
    this.name = name

    this.initEvent()
    this.registerNodes(nodes)
    this.state = FlowState.READY
  }

  // 流程编排


  initEvent(): void {
    this.on(FlowEvent.ON_STATE_CHANGE, this.handleFlowStateChange.bind(this))
  }

  handleFlowStateChange(flow: Flow): void {
    Flow.save(flow)
  }

  serialize() {
    return {
      nodes: Object.values(this.nodeMap).map(node => node.id)
    }
  }

  registerNodes(nodes: FlowData['nodes']): void {
    logger.info('registerNodes')

    this.nodeList = Object.values(nodes).map((node: string | NodeData) => {
      const instance = checkoutNode(node)
      instance.registerFlow()
      this.nodeMap[instance.id] = instance
      return instance
    })
    this.emit(FlowEvent.ON_REGISTER, this)
  }

  next() {
    logger.info('next')
    if (this.state === FlowState.END) throw new Error('Flow is END')

    this.activatedIndex += 1

    if (this.activatedIndex > -1 && this.activatedIndex < this.nodeList.length) this.state = FlowState.RUNNING
    else if (this.activatedIndex>= this.nodeList.length) this.state = FlowState.END

    if (this.state === FlowState.END) {
      this.activatedIndex = -1
      this.activatedNodeID = null
      return
    }
    
    const node = this.nodeList[this.activatedIndex]
    this.activatedNodeID = node.id
    node.state = NodeState.ACTIVATE
    this.emit(FlowEvent.ON_NEXT, this)
  }


  set state(state: FlowState) {
    this.flowState = state
    this.emit(FlowEvent.ON_STATE_CHANGE, this)
  }

  get state() {
    return this.flowState
  }

  get activatedNode() {
    return this.activatedNodeID && this.nodeMap[this.activatedNodeID]
  }

}

