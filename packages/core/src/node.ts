import EventEmitter from 'events'
import { v4 as uuid } from 'uuid'
import { Flow } from './flow'
import log4js from './logger'
import { nodeStorage } from './storage'


const logger = log4js.getLogger('node')


export interface NodeData {
  type: string;
  name: string;
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
}

export class Node extends EventEmitter {
  public id: string
  public name: string
  public nodeState: NodeState
  public flow?: Flow

  // private ctx: any


  static save(node: Node) {
    nodeStorage.set(`nodes.${node.id}`, node.serialize())
  }


  constructor(opt: NodeData) {
    super()
    this.id = uuid()
    this.nodeState = NodeState.INIT

    const { name } = opt
    this.name = name
    this.state = NodeState.CREATE
    this.initEvent()
  }


  initEvent(): void {
    this.on(NodeEvent.ON_STATE_CHANGE, this.handleNodeStateChange.bind(this))
  }

  handleNodeStateChange(): void {
    logger.info(this.id, `state change ${this.state}`)
    Node.save(this)
  }

  registerFlow(): void {
    logger.info('registerFlow')
    this.state = NodeState.REGISTERED
  }

  serialize() {
    return {
      flow: this.flow?.id
    }
  }

  set state(state: NodeState) {
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
