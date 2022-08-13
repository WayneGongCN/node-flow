import EventEmitter from 'events'
import { Logger } from 'log4js'
import { v4 as uuid } from 'uuid'
import { NodeFlowEvent } from './flow'
import log4js from './logger'
import { nodeStorage, saveNodeData } from './storage'


const nodeLogger = log4js.getLogger('NODE')

/**
 */
export const typeNodeMap: Record<string, typeof Node> = {}
// TODO: types
export function registerNode(TypeNode: any) {
  nodeLogger.log('registerNode: ', TypeNode.type)
  const type = TypeNode.type
  if (typeNodeMap[type]) throw new Error(`${type} Node extended`)
  typeNodeMap[type] = TypeNode
}


export interface NodeData {
  type: string;
  name?: string;
  id?: string;
  state?: NodeState;
  scope?: string;
}


export enum NodeEvent {
  STATE_CHANGE = 'STATE_CHANGE',
  ACTIVATE = 'ACTIVATE',
  COMPLETE = 'COMPLETE'
}


export enum NodeState {
  CREATE = 'CREATE',
  REGISTER = 'REGISTER',
  ACTIVATE = 'ACTIVATE',
  COMPLETE = 'COMPLETE'
}


export class Node<T extends NodeData> extends EventEmitter {
  static type = 'node'

  public id: string
  public name: string
  public type: string
  public nodeState: NodeState
  public logger: Logger


  static checkout(node: string) {
    const nodeData = nodeStorage.get(`nodes.${node}`) as NodeData | null
    nodeLogger.info('Node.checkout')
    if (!nodeData) throw new Error('Node ID Error')

    return Node.create(nodeData)
  }


  static create<T extends NodeData, R extends Node<T>>(nodeData: T): R {
    const { type } = nodeData
    nodeLogger.info('Node.create')
    const TypeNode = typeNodeMap[type]
    if (!TypeNode) throw new Error('Node Type Error')

    const instance = new TypeNode(nodeData)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return instance
  }


  constructor(protected options: T) {
    nodeLogger.info('[T] node constructor')
    nodeLogger.trace('node constructor', JSON.stringify(options))
    super()
    const { type, name = 'untitled', id = uuid(), state = NodeState.CREATE } = this.options
    this.type = type
    this.name = name
    this.id = id
    this.nodeState = state

    this.logger = log4js.getLogger(`NODE ${this.id}`)
    this.initEvent()
  }


  initEvent(): void {
    this.on(NodeEvent.STATE_CHANGE, this.handleNodeStateChange.bind(this))
  }


  async handleNodeStateChange(): Promise<void> {
    await this.save()
  }


  register() {
    if (this.state === NodeState.CREATE) {
      this.state = NodeState.REGISTER
    }
  }


  async activate(event: NodeFlowEvent) {
    this.state = NodeState.ACTIVATE

    this.logger.info('[T] start running ... ')
    this.logger.trace('event: ', JSON.stringify(event))
    try {
      const output = await this.run(event)
      this.complete(null, output)
    } catch (e: unknown) {
      this.complete(e, null)
    }
  }


  run(event: NodeFlowEvent) {
    // do something ...
    event[this.options.scope || this.id] = 'Hello world'
    return event
  }


  complete(err: null | any, event: NodeFlowEvent) {
    this.logger.info('[T] complete ')
    this.logger.trace(`error: ${err?.message || ''} event: ${JSON.stringify(event)}`)
    this.state = NodeState.COMPLETE
    this.emit(NodeEvent.COMPLETE, err, event)
  }

  
  setScope (event: NodeFlowEvent, value: any) {
    event[this.options.scope || this.id] = value
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
    this.emit(NodeEvent.STATE_CHANGE, this)
  }


  get state() {
    return this.nodeState
  }
}

registerNode(Node)