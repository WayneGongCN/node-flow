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
  typeNodeMap[type] = TypeNode
}


export interface NodeData {
  type: string;
  name?: string;
  id?: string;
  state?: NodeState;
}


export enum NodeEvent {
  STATE_CHANGE = 'STATE_CHANGE',
  ACTIVATE = 'ACTIVATE',
  COMPLETE = 'COMPLETE'
}


export enum NodeState {
  CREATE = 'CREATE',
  ACTIVATE = 'ACTIVATE',
  COMPLETE = 'COMPLETE'
}

export interface INode {
  run: (e: NodeFlowEvent) => Promise<NodeFlowEvent>;
}

export class Node<T extends NodeData> extends EventEmitter implements INode {
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
    let TypeNode = typeNodeMap[type]
    if (!TypeNode) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const requiredNode = require(`@node-flow/${type}`).default
      registerNode(requiredNode)
      TypeNode = requiredNode
    }

    const instance = new TypeNode(nodeData)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return instance
  }


  constructor(protected options: T) {
    super()
    const { type, name = 'untitled', id = uuid(), state = NodeState.CREATE } = this.options
    this.type = type
    this.name = name
    this.id = id
    this.nodeState = state

    this.logger = log4js.getLogger(`NODE ${this.id}`)
    this.logger.info('[T] node constructor')
    this.logger.trace('node constructor', JSON.stringify(options))
  }


  async activate(event: NodeFlowEvent) {
    this.state = NodeState.ACTIVATE

    this.logger.info('[T] start running ... ')
    this.logger.trace('event: ', JSON.stringify(event))
    try {
      const output = await this.run(event)
      this.complete(null, output)
    } catch (e: unknown) {
      this.complete(e, event)
    }
  }


  async run(event: NodeFlowEvent): Promise<NodeFlowEvent> {
    // do something ...
    event.payload = 'Hello world'

    return event
  }


  complete(err: null | any, event: NodeFlowEvent) {
    this.logger.info('[T] complete ')
    this.logger.trace(`error: ${err?.message || ''} event: ${JSON.stringify(event)}`)
    this.state = NodeState.COMPLETE
    this.emit(NodeEvent.COMPLETE, err, event)
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