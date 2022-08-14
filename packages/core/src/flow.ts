import EventEmitter from 'events'
import { Logger } from 'log4js'
import { v4 as uuid } from 'uuid'
import log4js from './logger'
import { Node, NodeData, NodeEvent, NodeState } from './node'
import { getActivateFlowID, getFlowDataByID, listFlow, removeFlowByID, saveActivateFlowID, saveFlowData } from './storage'

const flowLogger = log4js.getLogger('FLOW')

export interface FlowData {
  name: string;
  nodes: Node<NodeData>['id'][] | (NodeData & any)[];

  id?: string;
  state?: FlowState;
  activateNodeIdx?: number;
  event?: NodeFlowEvent
}


export enum FlowState {
  CREATE = 'CREATE',
  PROCESSING = 'PROCESSING',
  END = 'END',
}


export enum FlowEvent {
  STATE_CHANGE = 'STATE_CHANGE',
  NEXT = 'NEXT'
}


export type NodeFlowEvent = any


export class Flow extends EventEmitter {
  public id: string
  public name: string
  public flowState: FlowState

  public nodeMap: Record<Node<NodeData>['id'], Node<NodeData>>
  public nodeList: Node<NodeData>[]
  public activateNodeIdx: number
  public event: NodeFlowEvent

  public logger: Logger


  /**
   * 
   */
  static listFlow(all = false): Promise<FlowData[]> {
    return all ? listFlow() : listFlow(flow => flow.state !== FlowState.END)
  }


  /**
   * 
   */
  static async getActivatedFlow() {
    const flowID = await getActivateFlowID()
    if (!flowID) return null
    return Flow.checkoutFlow(flowID)
  }


  /**
   * 
   */
  static async checkoutFlow(flowID: Flow['id']): Promise<Flow | null> {
    const flowData = await getFlowDataByID(flowID)
    flowLogger.log('[T] Flow.checkoutFlow')
    flowLogger.trace(`flowData ${JSON.stringify(flowData)}`)
    if (!flowData) return null

    const flow = new Flow(flowData)
    return flow
  }


  /**
   * 
   */
  constructor(opt: FlowData) {
    flowLogger.info('[T] flow constructor')
    flowLogger.trace('flow constructor flowData: ', JSON.stringify(opt))
    super()
    this.nodeMap = {}
    this.nodeList = []

    const { name = 'untitled', nodes = [], id = uuid(), state = FlowState.CREATE, activateNodeIdx = -1, event = { _id: uuid() } } = opt
    this.name = name
    this.id = id
    this.flowState = state
    this.activateNodeIdx = activateNodeIdx
    this.event = event
    this.logger = log4js.getLogger(`FLOW ${this.id}`)

    this.initEvent()
    this.createNodes(nodes)
    this.save()
  }


  /**
   * 
   */
  initEvent() {
    this.on(FlowEvent.STATE_CHANGE, this.handleFlowStateChange.bind(this))
  }


  /**
   * 
   */
  handleFlowStateChange() {
    this.save()
  }


  /**
   * 
   */
  async handleNodeComplete(err: any, event: NodeFlowEvent) {
    this.event = event
    
    if (this.activateNodeIdx >= this.nodeList.length - 1) this.state = FlowState.END
    else await this.save()
  }


  /**
   * 
   */
  async activate() {
    return saveActivateFlowID(this.id)
  }


  /**
   * 
   */
  async save() {
    return saveFlowData(this.id, this.serialize())
  }


  /**
   * 
   */
  async remove() {
    const activateID = await getActivateFlowID()
    if (activateID === this.id) await saveActivateFlowID(null)
    await removeFlowByID(this.id)
  }


  /**
   * 
   */
  serialize(): FlowData {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      activateNodeIdx: this.activateNodeIdx,
      nodes: Object.values(this.nodeMap).map(node => node.id),
      event: this.event
    }
  }


  /**
   * 
   */
  createNodes(nodes: FlowData['nodes']): void {
    this.nodeList = nodes.map((nodeDataOrID: string | NodeData) => {
      const node = typeof nodeDataOrID === 'string' ? Node.checkout(nodeDataOrID) : Node.create(nodeDataOrID)
      this.nodeMap[node.id] = node
      node.on(NodeEvent.COMPLETE, this.handleNodeComplete.bind(this))
      return node
    })
  }


  /**
   * 
   */
  async next() {
    this.logger.info('next')
    if (this.state === FlowState.END) throw new Error('Flow is END')
    if (this.activatedNode && this.activatedNode.state !== NodeState.COMPLETE) throw new Error(`Node ${this.activatedNode.name}(${this.activatedNode.id}) is not complete`)

    if (++this.activateNodeIdx > -1 && this.activateNodeIdx < this.nodeList.length) this.state = FlowState.PROCESSING
    else if (this.activateNodeIdx >= this.nodeList.length) this.state = FlowState.END

    if (this.state === FlowState.END) {
      this.activateNodeIdx = -1
      return null
    }

    const node = this.nodeList[this.activateNodeIdx]
    node.activate(this.event)
    await this.save()

    this.emit(FlowEvent.NEXT, this)
    return node
  }


  /**
   * 
   */
  set state(state: FlowState) {
    if (this.flowState === state) return
    this.logger.debug(`state change ${this.flowState} --> ${state}`)
    this.flowState = state
    this.emit(FlowEvent.STATE_CHANGE, this)
  }


  /**
   * 
   */
  get state() {
    return this.flowState
  }


  /**
   * 
   */
  get activatedNode(): Node<NodeData> | null {
    return this.nodeList[this.activateNodeIdx] || null
  }
}

