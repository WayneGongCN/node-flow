import EventEmitter from 'events'
import { v4 as uuid } from 'uuid'
import { Flow } from './flow'
import log4js from './logger'
import { nodeStorage, saveNodeData } from './storage'


const logger = log4js.getLogger('node')


export interface NodeData {
  type: string;
  name: string;

  id?: string;
  state?: NodeState;
}


export enum NodeEvent {
  ON_STATE_CHANGE = 'ON_STATE_CHANGE',
}

export enum NodeState {
  INIT = 'INIT',
  CREATE = 'CREATE',
  REGISTERED = 'REGISTERED',
  ACTIVATE = 'ACTIVATE',
  DONE = 'DONE',
  READY = 'READY',
}

export class Node extends EventEmitter {
  public id: string
  public name: string
  public type: string
  public nodeState: NodeState
  public flow?: Flow

  // private ctx: any

  constructor(opt: NodeData) {
    super()
    const { type, name = 'untitled', id = uuid(), state = NodeState.CREATE } = opt
    this.type = type
    this.name = name
    this.id = id
    this.nodeState = state

    this.initEvent()
    this.state = state || NodeState.READY
  }


  initEvent(): void {
    this.on(NodeEvent.ON_STATE_CHANGE, this.handleNodeStateChange.bind(this))
  }

  handleNodeStateChange(): void {
    logger.debug(this.id, `state change ${this.state}`)
    this.save()
  }

  registerFlow() {
    logger.debug('registerFlow')
    this.state = NodeState.REGISTERED
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
    this.nodeState = state
    this.emit(NodeEvent.ON_STATE_CHANGE, this)
  }

  get state() {
    return this.nodeState
  }
}




const typeNodeMap: Record<string, typeof Node> = { node: Node }


/**
 * 注册自定义 Node
 * @param type 
 * @param TypeNode 
 */
export function registerNode(type: string, TypeNode: typeof Node) {
  if (typeNodeMap[type]) throw new Error(`${type} Node extended`)
  typeNodeMap[type] = TypeNode
}


/**
 * 实例化 Node 工厂函数
 * @param nodeData
 * @returns 
 */
export function createNode<P extends NodeData, R extends Node>(nodeData: P): R | Node {
  const { type } = nodeData
  const TypeNode = typeNodeMap[type]
  if (!TypeNode) throw new Error('Node Type Error')

  const instance = new TypeNode(nodeData)
  return instance
}



export function checkoutNode(node: string | NodeData) {
  let nodeData = null
  if (typeof node === 'string') nodeData = nodeStorage.get(`nodes.${node}`) as NodeData | null
  else nodeData = node
  if (!nodeData) throw new Error('Node ID Error')

  return createNode(nodeData)
}
