import { Node } from '@node-flow/core'
import { NodeData, NodeEvent, registerNode, NodeState } from '@node-flow/core/lib/node'
import inquirer, { Question } from 'inquirer'


export interface InquirerNodeData extends NodeData {
  questions: Question[]
}


class InquirerNode extends Node {
  static type = 'node-inquirer'

  public questions: Question[]

  constructor(nodeData: InquirerNodeData) {
    super(nodeData)
    this.questions = nodeData.questions
    this.on(NodeEvent.ON_ACTIVATE, this.onActivate.bind(this))
  }

  onActivate () {
    inquirer
      .prompt(this.questions)
      .then((answers: any) => {
        this.ctx = answers
        this.state = NodeState.COMPLETE
      })
  }
}


/**
 * 
 */
registerNode(InquirerNode)


export default InquirerNode
