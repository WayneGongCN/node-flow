import EventEmitter from 'events'
import { v4 as uuid } from 'uuid'
import log4js from './logger'
import { checkoutNode, Node, NodeData as NodeData, NodeState } from './node'
import { getActivateFlowID, getFlowDataByID, listFlow, removeFlowByID, saveActivateFlowID, saveFlowData } from './storage'

const logger = log4js.getLogger('flow')

export interface FlowData {
  name: string;
  nodes: Node['id'][] | NodeData[];

  id?: string;
  state?: FlowState;
  activatedIndex?: number;
}

export enum FlowState {
  INIT = 'INIT',
  RUNNING = 'RUNNING',
  END = 'END',
}

export enum FlowEvent {
  ON_STATE_CHANGE = 'ON_STATE_CHANGE',
  ON_REGISTER = 'ON_REGISTER',
  ON_NEXT = 'ON_NEXT'
}


export class Flow extends EventEmitter {
  public id: string
  protected flowState: FlowState
  public name: string

  public nodeMap: Record<Node['id'], Node>
  public nodeList: Node[]
  public activatedIndex: number

  public ctx: unknown


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
    if (!flowData) return null

    const flow = new Flow(flowData)
    return flow
  }


  constructor(opt: FlowData) {
    super()
    this.nodeMap = {}
    this.nodeList = []


    const { name = 'untitled', nodes = [], id = uuid(), state = FlowState.INIT, activatedIndex = -1 } = opt
    this.name = name
    this.id = id
    this.flowState = state
    this.activatedIndex = activatedIndex


    this.initEvent()
    this.registerNodes(nodes)
  }

  // 流程编排


  initEvent() {
    this.on(FlowEvent.ON_STATE_CHANGE, this.handleFlowStateChange.bind(this))
  }

  handleFlowStateChange() {
    this.save()
  }

  async activate() {
    await this.save()
    return saveActivateFlowID(this.id)
  }

  async save() {
    return saveFlowData(this.id, this.serialize())
  }

  async remove() {
    const activateID = await getActivateFlowID()
    if (activateID === this.id) await saveActivateFlowID(null)
    await removeFlowByID(this.id)
  }

  serialize(): FlowData {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      activatedIndex: this.activatedIndex,
      nodes: Object.values(this.nodeMap).map(node => node.id)
    }
  }

  registerNodes(nodes: FlowData['nodes']): void {
    logger.info('registerNodes', nodes)

    this.nodeList = nodes.map((node: string | NodeData) => {
      const instance = checkoutNode(node)
      instance.registerFlow()
      this.nodeMap[instance.id] = instance
      return instance
    })
    this.emit(FlowEvent.ON_REGISTER, this)
  }

  /**
   * 
   */
  next() {
    logger.info('next')
    if (this.state === FlowState.END) throw new Error('Flow is END')

    this.activatedIndex += 1

    if (this.activatedIndex > -1 && this.activatedIndex < this.nodeList.length) this.state = FlowState.RUNNING
    else if (this.activatedIndex >= this.nodeList.length) this.state = FlowState.END

    if (this.state === FlowState.END) {
      this.activatedIndex = -1
      return
    }

    const node = this.nodeList[this.activatedIndex]
    node.state = NodeState.ACTIVATE
    this.emit(FlowEvent.ON_NEXT, this)
  }


  set state(state: FlowState) {
    if (this.flowState === state) return
    this.flowState = state
    this.emit(FlowEvent.ON_STATE_CHANGE, this)
  }

  get state() {
    return this.flowState
  }


  get activateNodeID() {
    if (this.activatedIndex === -1) return null
    return this.nodeList[this.activatedIndex]?.id
  }

  get activatedNode(): Node | null {
    return this.activateNodeID ? this.nodeMap[this.activateNodeID]: null
  }
}

