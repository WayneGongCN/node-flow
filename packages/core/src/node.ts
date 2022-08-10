import EventEmitter from 'events'
import { Logger } from 'log4js'
import { v4 as uuid } from 'uuid'
import { Flow } from './flow'
import log4js from './logger'
import { nodeStorage, saveNodeData } from './storage'


/**
 * 注册自定义 Node
 * @param type 
 * @param TypeNode 
 */
export const typeNodeMap: Record<string, typeof Node> = {}
export function registerNode(TypeNode: typeof Node) {
  const type = TypeNode.type
  if (typeNodeMap[type]) throw new Error(`${type} Node extended`)
  typeNodeMap[type] = TypeNode
}


export interface NodeData {
  type: string;
  name: string;
  id?: string;
  state?: NodeState;
}


export enum NodeEvent {
  ON_STATE_CHANGE = 'ON_STATE_CHANGE',
  ON_ACTIVATE = 'ON_ACTIVATE',
  ON_COMPLETE = 'ON_COMPLETE',
  ON_CTX_CHANGE = 'ON_CTX_CHANGE',
}


export enum NodeState {
  CREATE = 'CREATE',
  REGISTER = 'REGISTER',
  ACTIVATE = 'ACTIVATE',
  COMPLETE = 'COMPLETE'
}


export class Node extends EventEmitter {
  static type = 'node'

  public id: string
  public name: string
  public type: string
  public nodeState: NodeState
  public nodeCtx: any
  public flow?: Flow

  private logger: Logger;


  static checkout(node: string) {
    let nodeData = null
    if (typeof node === 'string') nodeData = nodeStorage.get(`nodes.${node}`) as NodeData | null
    else nodeData = node
    if (!nodeData) throw new Error('Node ID Error')

    return Node.create(nodeData)
  }


  static create<T extends NodeData, R extends Node>(nodeData: T): R {
    const { type } = nodeData
    const TypeNode = typeNodeMap[type]
    if (!TypeNode) throw new Error('Node Type Error')

    const instance = new TypeNode(nodeData)
    // TODO: types
    // @ts-ignore
    return instance
  }


  constructor(opt: NodeData) {
    super()
    const { type, name = 'untitled', id = uuid(), state = NodeState.CREATE } = opt
    this.type = type
    this.name = name
    this.id = id
    this.nodeState = state

    this.logger = log4js.getLogger(`[NODE] ${this.id}`)
    this.initEvent()
  }


  initEvent(): void {
    this.on(NodeEvent.ON_STATE_CHANGE, this.handleNodeStateChange.bind(this))
    this.on(NodeEvent.ON_ACTIVATE, this.onActivate.bind(this))
  }


  handleNodeStateChange(): void {
    const eventMap = {
      [NodeState.ACTIVATE]: NodeEvent.ON_ACTIVATE,
      [NodeState.COMPLETE]: NodeEvent.ON_COMPLETE,
    }
    // TODO: types
    // @ts-ignore
    eventMap[this.state] && this.emit(eventMap[this.state], this)

    this.save()
  }

  
  onActivate() {
    this.ctx = null
    this.state = NodeState.COMPLETE
  }


  registerFlow() {
    this.state = NodeState.REGISTER
  }


  serialize(): NodeData {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      type: this.type,
    }
  }


  save() {
    return saveNodeData(this.id, this.serialize())
  }


  set state(state: NodeState) {
    if (this.nodeState === state) return
    this.logger.debug(`state change ${this.state} ---> ${state}`)
    this.nodeState = state
    this.emit(NodeEvent.ON_STATE_CHANGE, this)
  }


  get state() {
    return this.nodeState
  }


  set ctx(ctx: any) {
    this.logger.debug(`ctx change [T]`)
    this.logger.trace(`ctx change ${JSON.stringify(ctx)}`)
    this.nodeCtx = ctx
    this.emit(NodeEvent.ON_CTX_CHANGE, this)
  }


  get ctx() {
    return this.nodeCtx
  }
}

registerNode(Node)